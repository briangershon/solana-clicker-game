// layer connecting game with Anchor contract

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Provider, web3 } from "@project-serum/anchor";

const programAddress = new PublicKey(
  "Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w"
);

type WalletAndNetwork = {
  wallet: AnchorWallet;
  endpoint: string;
};

type GameState = {
  clicks: number;
  gameAccountPublicKey: string;
  isReady: boolean;
  errorMessage: string;
};

async function isGameInitialized({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<GameState> {
  try {
    const program = await getProgram({ wallet, endpoint });
    let games = await myGames(wallet, await program.account.game.all());

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
      games = await myGames(wallet, await program.account.game.all());
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

async function saveClick({ wallet, endpoint }: WalletAndNetwork) {
  const program = await getProgram({ wallet, endpoint });
  const games = await myGames(wallet, await program.account.game.all());
  if (games.length !== 0) {
    const game = games[0];
    return await program.methods
      .click()
      .accounts({
        game: game.publicKey,
      })
      .rpc();
  }
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

async function myGames(wallet: AnchorWallet, games: any[]): Promise<any[]> {
  return games.filter(
    (game) => game.account.player.toString() === wallet.publicKey.toBase58()
  );
}

export { isGameInitialized, saveClick };
