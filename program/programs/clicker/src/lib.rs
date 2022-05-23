use anchor_lang::prelude::*;
use anchor_lang::error_code;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod clicker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game: &mut Account<Game> = &mut ctx.accounts.game;
        let player: &Signer = &ctx.accounts.player;

        game.player = *player.key;
        game.clicks = 0;

        Ok(())
    }
    
    pub fn click(ctx: Context<Play>) -> Result<()> {
        let game: &mut Account<Game> = &mut ctx.accounts.game;

        require_keys_eq!(
            game.player.key(),
            ctx.accounts.player.key(),
            ClickerError::InvalidPlayer
        );

        game.clicks += 1;

        Ok(())
    }
}


#[account]
#[derive(Default)]
pub struct Game {
    player: Pubkey,     // 32 bytes
    clicks: u32,        // 4 bytes
}

impl Game {
    pub const MAXIMUM_SIZE: usize = 32 + 4;
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = player, space = 8 + Game::MAXIMUM_SIZE)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[error_code]
pub enum ClickerError {
    InvalidPlayer,
}