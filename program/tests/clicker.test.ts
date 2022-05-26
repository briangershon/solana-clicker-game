import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Clicker } from "../target/types/clicker";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { expect } from "chai";
chai.use(chaiAsPromised);

describe("clicker", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Clicker as Program<Clicker>;
  const programProvider = program.provider as anchor.AnchorProvider;

  it("is initialized", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const player = programProvider.wallet;

    // call initialize()
    await program.methods
      .initialize()
      .accounts({
        game: gameKeypair.publicKey,
        player: player.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);

    expect(gameState.clicks).to.equal(0);
    expect(gameState.player).to.eql(player.publicKey);
  });

  it("registers a click", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const player = programProvider.wallet;

    // call initialize()
    await program.methods
      .initialize()
      .accounts({
        game: gameKeypair.publicKey,
        player: player.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.clicks).to.equal(0);
    expect(gameState.player).to.eql(player.publicKey);

    // call click()
    await program.methods
      .click()
      .accounts({
        game: gameKeypair.publicKey,
      })
      .rpc();

    gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.clicks).to.equal(1);
  });
});
