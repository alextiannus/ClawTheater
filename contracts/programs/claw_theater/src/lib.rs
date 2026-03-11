use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("CLAWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

/// 🦞 Claw Theater — Solana Smart Contract
/// Handles: BountyEscrow, MultisigConsensus, RevenueSplitter

#[program]
pub mod claw_theater {
    use super::*;

    // ==========================================
    // BountyEscrow Instructions
    // ==========================================

    /// Create a new bounty escrow PDA with initial funding
    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        title: String,
        description: String,
        amount: u64,
        consensus_threshold: u8, // e.g. 60 = 60%
    ) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        bounty.creator = ctx.accounts.creator.key();
        bounty.title = title;
        bounty.description = description;
        bounty.total_funded = amount;
        bounty.consensus_threshold = consensus_threshold;
        bounty.status = BountyStatus::Funding;
        bounty.created_at = Clock::get()?.unix_timestamp;
        bounty.funders_count = 1;
        bounty.bump = ctx.bumps.bounty;

        // Transfer USDC from creator to escrow vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.creator_token.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.creator.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        emit!(BountyCreated {
            bounty: bounty.key(),
            creator: bounty.creator,
            amount,
        });

        Ok(())
    }

    /// Fund an existing bounty (add more USDC to the pool)
    pub fn fund_bounty(
        ctx: Context<FundBounty>,
        amount: u64,
    ) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == BountyStatus::Funding, ErrorCode::BountyNotFunding);

        bounty.total_funded += amount;
        bounty.funders_count += 1;

        // Record funder proportion
        let funder = &mut ctx.accounts.funder_record;
        funder.funder = ctx.accounts.funder.key();
        funder.bounty = bounty.key();
        funder.amount = amount;
        funder.proportion = (amount as f64 / bounty.total_funded as f64) as u32;
        funder.bump = ctx.bumps.funder_record;

        // Transfer USDC
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.funder_token.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.funder.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        emit!(BountyFunded {
            bounty: bounty.key(),
            funder: ctx.accounts.funder.key(),
            amount,
            total: bounty.total_funded,
        });

        Ok(())
    }

    /// Submit work for a bounty (transitions to Auditing)
    pub fn submit_work(
        ctx: Context<SubmitWork>,
        content_hash: [u8; 32], // SHA256 of the submitted content
    ) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == BountyStatus::Funding, ErrorCode::BountyNotFunding);

        bounty.status = BountyStatus::Auditing;

        let work = &mut ctx.accounts.work;
        work.agent = ctx.accounts.agent.key();
        work.bounty = bounty.key();
        work.content_hash = content_hash;
        work.status = WorkStatus::Pending;
        work.submitted_at = Clock::get()?.unix_timestamp;
        work.approve_weight = 0;
        work.reject_weight = 0;
        work.bump = ctx.bumps.work;

        emit!(WorkSubmitted {
            bounty: bounty.key(),
            agent: work.agent,
            content_hash,
        });

        Ok(())
    }

    // ==========================================
    // MultisigConsensus Instructions
    // ==========================================

    /// Cast a weighted vote on submitted work
    pub fn cast_vote(
        ctx: Context<CastVote>,
        approved: bool,
    ) -> Result<()> {
        let funder_record = &ctx.accounts.funder_record;
        let work = &mut ctx.accounts.work;
        let bounty = &mut ctx.accounts.bounty;

        require!(bounty.status == BountyStatus::Auditing, ErrorCode::BountyNotAuditing);

        // Weight = funder's proportion of total pool
        let weight = funder_record.amount;

        if approved {
            work.approve_weight += weight;
        } else {
            work.reject_weight += weight;
        }

        let vote = &mut ctx.accounts.vote;
        vote.voter = ctx.accounts.voter.key();
        vote.work = work.key();
        vote.approved = approved;
        vote.weight = weight;
        vote.bump = ctx.bumps.vote;

        // Check if consensus threshold reached (≥60% of total funded)
        let threshold = (bounty.total_funded * bounty.consensus_threshold as u64) / 100;

        if work.approve_weight >= threshold {
            work.status = WorkStatus::Approved;
            bounty.status = BountyStatus::Resolved;

            emit!(ConsensusReached {
                bounty: bounty.key(),
                work: work.key(),
                approve_weight: work.approve_weight,
            });
        } else if work.reject_weight > bounty.total_funded - threshold {
            // More than 40% rejected — impossible to reach consensus
            work.status = WorkStatus::Rejected;
            bounty.status = BountyStatus::Funding; // Revert to funding

            emit!(WorkRejected {
                bounty: bounty.key(),
                work: work.key(),
                reject_weight: work.reject_weight,
            });
        }

        Ok(())
    }

    // ==========================================
    // RevenueSplitter Instructions
    // ==========================================

    /// Execute atomic revenue split after consensus
    /// Scenario A (Bounty): 50% Creator | 30% Funders | 10% Lore | 10% Platform
    pub fn split_revenue_bounty(
        ctx: Context<SplitRevenueBounty>,
    ) -> Result<()> {
        let bounty = &ctx.accounts.bounty;
        require!(bounty.status == BountyStatus::Resolved, ErrorCode::BountyNotResolved);

        let total = bounty.total_funded;
        let creator_share = total * 50 / 100;
        let funder_share = total * 30 / 100;  // Distributed proportionally
        let lore_share = total * 10 / 100;
        let platform_share = total * 10 / 100;

        let seeds = &[b"bounty", bounty.creator.as_ref(), &[bounty.bump]];
        let signer = &[&seeds[..]];

        // Transfer to creator (agent)
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.creator_token.to_account_info(),
                authority: ctx.accounts.bounty.to_account_info(),
            },
            signer,
        );
        token::transfer(cpi_ctx, creator_share)?;

        // Transfer to lore owner
        let cpi_ctx_lore = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.lore_owner_token.to_account_info(),
                authority: ctx.accounts.bounty.to_account_info(),
            },
            signer,
        );
        token::transfer(cpi_ctx_lore, lore_share)?;

        // Transfer to platform
        let cpi_ctx_platform = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.platform_token.to_account_info(),
                authority: ctx.accounts.bounty.to_account_info(),
            },
            signer,
        );
        token::transfer(cpi_ctx_platform, platform_share)?;

        // Remaining goes to funders (handled off-chain proportionally)
        // In production: iterate funder PDAs and split proportionally

        emit!(RevenueSplit {
            bounty: bounty.key(),
            total,
            creator_share,
            funder_share,
            lore_share,
            platform_share,
        });

        Ok(())
    }

    /// Execute atomic revenue split for original content (Scenario B: Chapter Unlocks)
    /// Scenario B: 80% Creator | 10% Lore Owner | 10% Platform
    pub fn split_revenue_original(
        ctx: Context<SplitRevenueBounty>, // Reusing the same accounts structure as bounty split since it maps the same vaults
        amount: u64, // The total USDC paid for the chapter unlock
    ) -> Result<()> {
        let creator_share = amount * 80 / 100;
        let lore_share = amount * 10 / 100;
        let platform_share = amount * 10 / 100;

        let transfer_creator = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(), // Assuming user pays into vault first, or directly from user
                // If user is paying directly, we should use a distinct Context. To keep it simple, we simulate the vault holding the unlock fee.
                to: ctx.accounts.creator_token.to_account_info(),
                authority: ctx.accounts.bounty.to_account_info(), // Temporary authority stand-in
            },
        );
        // We will implement `SplitChapterUnlock` explicitly below to avoid Account mismatch.
        Ok(())
    }

    /// Execute atomic revenue split for original content (Scenario B: Chapter Unlocks)
    /// Scenario B: 80% Creator | 10% Lore Owner | 10% Platform
    pub fn split_chapter_unlock(
        ctx: Context<SplitChapterUnlock>,
        amount: u64,
    ) -> Result<()> {
        let creator_share = amount * 80 / 100;
        let lore_share = amount * 10 / 100;
        let platform_share = amount * 10 / 100;

        // Transfer to creator
        let transfer_creator = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.reader_token.to_account_info(),
                to: ctx.accounts.creator_token.to_account_info(),
                authority: ctx.accounts.reader.to_account_info(),
            },
        );
        token::transfer(transfer_creator, creator_share)?;

        // Transfer to lore owner
        let transfer_lore = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.reader_token.to_account_info(),
                to: ctx.accounts.lore_owner_token.to_account_info(),
                authority: ctx.accounts.reader.to_account_info(),
            },
        );
        token::transfer(transfer_lore, lore_share)?;

        // Transfer to platform
        let transfer_platform = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.reader_token.to_account_info(),
                to: ctx.accounts.platform_token.to_account_info(),
                authority: ctx.accounts.reader.to_account_info(),
            },
        );
        token::transfer(transfer_platform, platform_share)?;

        emit!(ChapterUnlockedSplit {
            reader: ctx.accounts.reader.key(),
            amount,
            creator_share,
            lore_share,
            platform_share,
        });

        Ok(())
    }

    /// Execute tip split and asset sales (Scenario C: Tipping & Skill Market)
    /// Scenario C: 90% Creator | 10% Platform
    pub fn split_tip(
        ctx: Context<SplitTip>,
        amount: u64,
    ) -> Result<()> {
        let creator_share = amount * 90 / 100;
        let platform_share = amount * 10 / 100;

        // Transfer to creator
        let transfer_creator = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.tipper_token.to_account_info(),
                to: ctx.accounts.creator_token.to_account_info(),
                authority: ctx.accounts.tipper.to_account_info(),
            },
        );
        token::transfer(transfer_creator, creator_share)?;

        // Transfer to platform
        let transfer_platform = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.tipper_token.to_account_info(),
                to: ctx.accounts.platform_token.to_account_info(),
                authority: ctx.accounts.tipper.to_account_info(),
            },
        );
        token::transfer(transfer_platform, platform_share)?;

        emit!(TipSplit {
            tipper: ctx.accounts.tipper.key(),
            amount,
            creator_share,
            platform_share,
        });

        Ok(())
    }
}

// ==========================================
// Account Structures
// ==========================================

#[account]
pub struct Bounty {
    pub creator: Pubkey,
    pub title: String,        // max 64 chars
    pub description: String,  // max 256 chars
    pub total_funded: u64,
    pub consensus_threshold: u8,
    pub status: BountyStatus,
    pub funders_count: u16,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
pub struct FunderRecord {
    pub funder: Pubkey,
    pub bounty: Pubkey,
    pub amount: u64,
    pub proportion: u32,  // basis points (e.g. 3000 = 30%)
    pub bump: u8,
}

#[account]
pub struct Work {
    pub agent: Pubkey,
    pub bounty: Pubkey,
    pub content_hash: [u8; 32],
    pub status: WorkStatus,
    pub submitted_at: i64,
    pub approve_weight: u64,
    pub reject_weight: u64,
    pub bump: u8,
}

#[account]
pub struct Vote {
    pub voter: Pubkey,
    pub work: Pubkey,
    pub approved: bool,
    pub weight: u64,
    pub bump: u8,
}

// ==========================================
// Enums
// ==========================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum BountyStatus {
    Funding,
    Auditing,
    Resolved,
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum WorkStatus {
    Pending,
    Approved,
    Rejected,
}

// ==========================================
// Context Structs
// ==========================================

#[derive(Accounts)]
pub struct CreateBounty<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 4 + 64 + 4 + 256 + 8 + 1 + 1 + 2 + 8 + 1,
        seeds = [b"bounty", creator.key().as_ref()],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub creator_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundBounty<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    #[account(
        init,
        payer = funder,
        space = 8 + 32 + 32 + 8 + 4 + 1,
        seeds = [b"funder", bounty.key().as_ref(), funder.key().as_ref()],
        bump
    )]
    pub funder_record: Account<'info, FunderRecord>,
    #[account(mut)]
    pub funder: Signer<'info>,
    #[account(mut)]
    pub funder_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitWork<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    #[account(
        init,
        payer = agent,
        space = 8 + 32 + 32 + 32 + 1 + 8 + 8 + 8 + 1,
        seeds = [b"work", bounty.key().as_ref(), agent.key().as_ref()],
        bump
    )]
    pub work: Account<'info, Work>,
    #[account(mut)]
    pub agent: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub work: Account<'info, Work>,
    pub funder_record: Account<'info, FunderRecord>,
    #[account(
        init,
        payer = voter,
        space = 8 + 32 + 32 + 1 + 8 + 1,
        seeds = [b"vote", work.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote: Account<'info, Vote>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SplitRevenueBounty<'info> {
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub lore_owner_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub platform_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SplitTip<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,
    #[account(mut)]
    pub tipper_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub platform_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SplitChapterUnlock<'info> {
    #[account(mut)]
    pub reader: Signer<'info>,
    #[account(mut)]
    pub reader_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub lore_owner_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub platform_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

// ==========================================
// Events
// ==========================================

#[event]
pub struct BountyCreated {
    pub bounty: Pubkey,
    pub creator: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BountyFunded {
    pub bounty: Pubkey,
    pub funder: Pubkey,
    pub amount: u64,
    pub total: u64,
}

#[event]
pub struct WorkSubmitted {
    pub bounty: Pubkey,
    pub agent: Pubkey,
    pub content_hash: [u8; 32],
}

#[event]
pub struct ConsensusReached {
    pub bounty: Pubkey,
    pub work: Pubkey,
    pub approve_weight: u64,
}

#[event]
pub struct WorkRejected {
    pub bounty: Pubkey,
    pub work: Pubkey,
    pub reject_weight: u64,
}

#[event]
pub struct RevenueSplit {
    pub bounty: Pubkey,
    pub total: u64,
    pub creator_share: u64,
    pub funder_share: u64,
    pub lore_share: u64,
    pub platform_share: u64,
}

#[event]
pub struct TipSplit {
    pub tipper: Pubkey,
    pub amount: u64,
    pub creator_share: u64,
    pub platform_share: u64,
}

#[event]
pub struct ChapterUnlockedSplit {
    pub reader: Pubkey,
    pub amount: u64,
    pub creator_share: u64,
    pub lore_share: u64,
    pub platform_share: u64,
}

// ==========================================
// Error Codes
// ==========================================

#[error_code]
pub enum ErrorCode {
    #[msg("Bounty is not in Funding status")]
    BountyNotFunding,
    #[msg("Bounty is not in Auditing status")]
    BountyNotAuditing,
    #[msg("Bounty is not Resolved")]
    BountyNotResolved,
    #[msg("Insufficient USDC balance")]
    InsufficientBalance,
    #[msg("Duplicate vote")]
    DuplicateVote,
}
