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
  isReady: boolean;
  errorMessage: string | null;
};

async function isGameInitialized({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<GameState> {
  try {
    const program = await getProgram({ wallet, endpoint });
    const games = await program.account.game.all();
    if (games.length === 0) {
      // create a new game
      const gameAccountKeypair = web3.Keypair.generate();
      console.log(`Creating new game at ${gameAccountKeypair.publicKey}`);
      const tx = await program.methods
        .initialize()
        .accounts({
          game: gameAccountKeypair.publicKey,
          player: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([gameAccountKeypair])
        .rpc();
    }
    return {
      clicks: games[0].account.clicks as number,
      isReady: true,
      errorMessage: null,
    };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return {
        clicks: 0,
        isReady: false,
        errorMessage: e.message,
      };
    }
    return {
      clicks: 0,
      isReady: false,
      errorMessage: "unknown error",
    };
  }
}

async function saveClick({ wallet, endpoint }: WalletAndNetwork) {
  const program = await getProgram({ wallet, endpoint });
  const games = await program.account.game.all();
  if (games.length !== 0) {
    const game = games[0];
    console.log("game", game.publicKey.toBase58(), game);
    console.log("current clicks", game.account.clicks);
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

export { isGameInitialized, saveClick };
