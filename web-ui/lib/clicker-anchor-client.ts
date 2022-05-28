// layer connecting game with Anchor contract

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Provider, web3 } from "@project-serum/anchor";

const programAddress = new PublicKey(
  "Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w"
);

// Type of object coming back from `program.account.game.all()` call
type ClickerGameObject = {
  publicKey: PublicKey; // game's key
  account: {
    player: PublicKey; // player's key
    clicks: number; // total clicks
  };
};

type WalletAndNetwork = {
  wallet: AnchorWallet;
  endpoint: string;
};

type WalletAndGamePublicKey = {
  wallet: AnchorWallet;
  endpoint: string;
  gameAccountPublicKey: string;
};

type GameState = {
  clicks: number;
  gameAccountPublicKey: string;
  isReady: boolean;
  errorMessage: string;
};

export type LeaderboardItem = {
  gameAccountPublicKey: string;
  clicks: number;
};

async function getCurrentGame({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<GameState> {
  try {
    const program = await getProgram({ wallet, endpoint });
    let games = await myGames(
      wallet,
      (await program.account.game.all()) as ClickerGameObject[]
    );

    if (games.length === 0) {
      // create a new game
      const gameAccountKeypair = web3.Keypair.generate();
      const tx = await program.methods
        .initialize()
        .accounts({
          game: gameAccountKeypair.publicKey,
          player: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([gameAccountKeypair])
        .rpc();

      // refresh list of games
      games = await myGames(
        wallet,
        (await program.account.game.all()) as ClickerGameObject[]
      );
    }

    const game = games[0];

    return {
      clicks: game.account.clicks as number,
      isReady: true,
      gameAccountPublicKey: game.publicKey.toBase58(),
      errorMessage: "",
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        clicks: 0,
        isReady: false,
        gameAccountPublicKey: "",
        errorMessage: e.message,
      };
    }
    return {
      clicks: 0,
      isReady: false,
      gameAccountPublicKey: "",
      errorMessage: "unknown error",
    };
  }
}

async function saveClick({
  wallet,
  endpoint,
  gameAccountPublicKey,
}: WalletAndGamePublicKey) {
  const program = await getProgram({ wallet, endpoint });
  return await program.methods
    .click()
    .accounts({
      game: gameAccountPublicKey,
    })
    .rpc();
}

async function getConnectionProvider({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<Provider> {
  const connection = new Connection(endpoint, "processed");
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
    commitment: "processed",
  });
  return provider;
}

async function getProgram({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<Program> {
  const provider = await getConnectionProvider({ wallet, endpoint });
  const idl = await Program.fetchIdl(programAddress, provider);
  if (idl === null) {
    throw new Error("Solana program missing IDL");
  }
  return new Program(idl, programAddress, provider);
}

async function myGames(
  wallet: AnchorWallet,
  games: ClickerGameObject[]
): Promise<ClickerGameObject[]> {
  return games.filter(
    (game) => game.account.player.toString() === wallet.publicKey.toBase58()
  );
}

async function getLeaderboard({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<LeaderboardItem[]> {
  try {
    const program = await getProgram({ wallet, endpoint });
    let games = (await program.account.game.all()) as ClickerGameObject[];
    const unsortedGames = games.map((g) => {
      const item: LeaderboardItem = {
        gameAccountPublicKey: g.account.player.toString(),
        clicks: g.account.clicks,
      };
      return item;
    });
    return unsortedGames.sort((a, b) => b.clicks - a.clicks);
  } catch (e) {
    console.error("problem retrieving games");
  }
  return [];
}

export { getCurrentGame, saveClick, getLeaderboard };
