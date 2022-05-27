# Solana Program for Clicker Game

## Run locally

    cd programs
    yarn install

## Run tests

    # make sure Anchor.toml `cluster` is set to "localnet" before running tests
    anchor test

## Deploy

Prereqs: You'll need Docker installed for verification steps.

Deploy on devnet.

- `cd program`
- Run `anchor build`. Your program keypair is now in target/deploy. Keep this keypair secret. You can reuse it on all clusters.
- Run `anchor keys list` to display the keypair's public key and copy it into your declare_id! macro at the top of lib.rs.
- Run `anchor build --verifiable` again. This step is necessary to include the new program id in the binary.
- Change the `provider.cluster` variable in Anchor.toml to `devnet`.
- Run `solana program deploy --program-id target/deploy/clicker-keypair.json target/deploy/clicker.so`
- Upload IDL for front-end: `anchor idl init -f target/idl/clicker.json Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w` (or use `update` instead of `init` for subsequent updates)
- **This step not working yet, I'm getting "Binaries don't match" error.** ~~Verify via `anchor verify -p "clicker" Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w`~~
- Show program summary via `solana program show Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w`
