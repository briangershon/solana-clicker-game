# Solana Program for Clicker Game

## Run locally

    cd programs
    yarn install

## Run tests

    anchor test

## Deploy

Deploy on devnet.

- `cd program`
- Run `anchor build`. Your program keypair is now in target/deploy. Keep this keypair secret. You can reuse it on all clusters.
- Run `anchor keys list` to display the keypair's public key and copy it into your declare_id! macro at the top of lib.rs.
- Run `anchor build` again. This step is necessary to include the new program id in the binary.
- Change the `provider.cluster` variable in Anchor.toml to `devnet`.
- Run `solana program deploy --program-id <KEYPAIR_FILEPATH> <PROGRAM_FILEPATH>`
- Show program summary via `solana program show Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w`
