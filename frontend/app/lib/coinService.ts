import { prisma } from "./prisma";

// Claw Coin Constants
export const CC_EXCHANGE_RATE = 100; // 1 USDC = 100 CC
export const MIN_WITHDRAW_CC = 500; // 5 USDC minimum to withdraw

export const CC_SPLITS = {
  ORIGINAL_NOVEL: { creator: 0.8, loreOwner: 0.1, platform: 0.1 },
  BOUNTY_REWARD: { creator: 0.5, funders: 0.3, loreOwner: 0.1, platform: 0.1 },
  SKILL_SALE: { creator: 0.9, platform: 0.1 },
};

export const CoinService = {
  /**
   * Add coins to a User or Agent account (e.g., from Fiat/Crypto Deposit)
   */
  deposit: async (
    targetType: "USER" | "AGENT",
    targetId: string,
    amountCC: number,
    referenceId?: string,
    note?: string
  ) => {
    return prisma.$transaction(async (tx) => {
      let balanceAfter = 0;
      if (targetType === "USER") {
        const u = await tx.user.update({
          where: { id: targetId },
          data: { clawCoinBalance: { increment: amountCC } },
        });
        balanceAfter = u.clawCoinBalance;
        await tx.coinTransaction.create({
          data: {
            amount: amountCC,
            balanceAfter,
            type: "DEPOSIT",
            userId: targetId,
            referenceId,
            note,
          },
        });
      } else {
        const a = await tx.agent.update({
          where: { id: targetId },
          data: { clawCoinBalance: { increment: amountCC } },
        });
        balanceAfter = a.clawCoinBalance;
        await tx.coinTransaction.create({
          data: {
            amount: amountCC,
            balanceAfter,
            type: "DEPOSIT",
            agentId: targetId,
            referenceId,
            note,
          },
        });
      }
      return balanceAfter;
    });
  },

  /**
   * Atomically unlocks a chapter and distributes the CC across the ecosystem
   */
  unlockChapter: async (userId: string, chapterId: string, priceCC: number) => {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Deduct from reader
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user || user.clawCoinBalance < priceCC) {
          throw new Error("Insufficient Claw Coins");
        }

        const u = await tx.user.update({
          where: { id: userId },
          data: { clawCoinBalance: { decrement: priceCC } },
        });

        await tx.coinTransaction.create({
          data: {
            amount: -priceCC,
            balanceAfter: u.clawCoinBalance,
            type: "CHAPTER_UNLOCK",
            userId,
            referenceId: chapterId,
            note: "Unlocked Chapter",
          },
        });

        // 2. Fetch chapter & novel details
        const chapter = await tx.chapter.findUnique({
          where: { id: chapterId },
          include: { novel: true },
        });
        if (!chapter) throw new Error("Chapter not found");

        // 3. Compute Splits
        const creatorSplit = Math.floor(priceCC * CC_SPLITS.ORIGINAL_NOVEL.creator);
        let loreSplit = Math.floor(priceCC * CC_SPLITS.ORIGINAL_NOVEL.loreOwner);
        const platformSplit = priceCC - creatorSplit - loreSplit;

        // Give to Agent Creator
        if (chapter.novel.agentId) {
          const agent = await tx.agent.update({
            where: { id: chapter.novel.agentId },
            data: { clawCoinBalance: { increment: creatorSplit } },
          });
          await tx.coinTransaction.create({
            data: {
              amount: creatorSplit,
              balanceAfter: agent.clawCoinBalance,
              type: "CHAPTER_UNLOCK",
              agentId: agent.id,
              referenceId: chapterId,
              note: "Revenue from Chapter Unlock",
            },
          });
        } 
        
        // Give to Lore Owner
        let loreOwnerFound = false;
        if (chapter.novel.loreId) {
          const lore = await tx.lore.findUnique({ where: { id: chapter.novel.loreId } });
          if (lore?.creatorId) {
            loreOwnerFound = true;
            const lu = await tx.user.update({
              where: { id: lore.creatorId },
              data: { clawCoinBalance: { increment: loreSplit } },
            });
            await tx.coinTransaction.create({
              data: {
                amount: loreSplit,
                balanceAfter: lu.clawCoinBalance,
                type: "CHAPTER_UNLOCK",
                userId: lu.id,
                referenceId: chapterId,
                note: "Lore Royalty from Chapter",
              },
            });
          }
        }
        
        // If no lore owner exists, add the lore split to the platform split or just discard tracking for now (Platform treasury is implicitly unallocated coins in DB)

        // Increase the novel's total revenue for heat tracing. Convert CC back to USD conceptually, or keep in CC? 
        // 1 USDC = 100 CC. So USDC Revenue = priceCC / CC_EXCHANGE_RATE
        await tx.novel.update({
          where: { id: chapter.novel.id },
          data: { totalRevenue: { increment: priceCC / CC_EXCHANGE_RATE } }
        });

        return { success: true, balanceAfter: u.clawCoinBalance };
      });
    } catch (e: any) {
      console.error("Unlock Error:", e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Simple Tip directly to an Agent or User
   */
  tip: async (tipperUserId: string, targetType: "USER" | "AGENT", targetId: string, amountCC: number, chapterId?: string) => {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Deduct from Tipper
        const tipper = await tx.user.findUnique({ where: { id: tipperUserId } });
        if (!tipper || tipper.clawCoinBalance < amountCC) {
          throw new Error("Insufficient Claw Coins");
        }

        const ti = await tx.user.update({
          where: { id: tipperUserId },
          data: { clawCoinBalance: { decrement: amountCC } },
        });

        await tx.coinTransaction.create({
          data: {
            amount: -amountCC,
            balanceAfter: ti.clawCoinBalance,
            type: "TIP_SENT",
            userId: tipperUserId,
            referenceId: chapterId,
            note: "Sent tip",
          },
        });

        // 2. 90% goes to target, 10% platform
        const tipCut = Math.floor(amountCC * 0.9);

        if (targetType === "USER") {
          const tu = await tx.user.update({
            where: { id: targetId },
            data: { clawCoinBalance: { increment: tipCut } },
          });
          await tx.coinTransaction.create({
            data: {
              amount: tipCut,
              balanceAfter: tu.clawCoinBalance,
              type: "TIP_RECEIVED",
              userId: targetId,
              referenceId: chapterId,
              note: "Received tip",
            },
          });
        } else {
          const ta = await tx.agent.update({
            where: { id: targetId },
            data: { clawCoinBalance: { increment: tipCut } },
          });
          await tx.coinTransaction.create({
            data: {
              amount: tipCut,
              balanceAfter: ta.clawCoinBalance,
              type: "TIP_RECEIVED",
              agentId: targetId,
              referenceId: chapterId,
              note: "Received tip",
            },
          });
        }
        
        // Update novel's total revenue if tied to a chapter
        if (chapterId) {
          const chapter = await tx.chapter.findUnique({ where: { id: chapterId }});
          if (chapter) {
            await tx.novel.update({
              where: { id: chapter.novelId },
              data: {
                tipCount: { increment: 1 },
                totalRevenue: { increment: amountCC / CC_EXCHANGE_RATE }
              }
            });
            // Also explicitly record Tip model for old frontend counting dependencies
            await tx.tip.create({
              data: {
                amount: amountCC / CC_EXCHANGE_RATE, // Storing Tip legacy format in USD equivalent
                userId: tipperUserId,
                chapterId: chapterId
              }
            });
          }
        }

        return { success: true, balanceAfter: ti.clawCoinBalance };
      });
    } catch (e: any) {
      console.error("Tip Error:", e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Funds an existing bounty
   */
  fundBounty: async (funderType: "USER" | "AGENT", funderId: string, bountyId: string, amountCC: number) => {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Deduct from Funder
        let balanceAfter = 0;
        if (funderType === "USER") {
          const user = await tx.user.findUnique({ where: { id: funderId } });
          if (!user || user.clawCoinBalance < amountCC) throw new Error("Insufficient Claw Coins");

          const u = await tx.user.update({
            where: { id: funderId },
            data: { clawCoinBalance: { decrement: amountCC } },
          });
          balanceAfter = u.clawCoinBalance;

          await tx.coinTransaction.create({
            data: { amount: -amountCC, balanceAfter, type: "BOUNTY_FUND", userId: funderId, referenceId: bountyId, note: "Funded bounty" }
          });
        } else {
          const agent = await tx.agent.findUnique({ where: { id: funderId } });
          if (!agent || agent.clawCoinBalance < amountCC) throw new Error("Insufficient Claw Coins");

          const a = await tx.agent.update({
            where: { id: funderId },
            data: { clawCoinBalance: { decrement: amountCC } },
          });
          balanceAfter = a.clawCoinBalance;

          await tx.coinTransaction.create({
            data: { amount: -amountCC, balanceAfter, type: "BOUNTY_FUND", agentId: funderId, referenceId: bountyId, note: "Funded bounty" }
          });
        }

        // 2. Add to Bounty and create Funding record
        const bounty = await tx.bounty.update({
          where: { id: bountyId },
          data: { totalFunded: { increment: amountCC } }
        });

        await tx.funding.create({
          data: {
            amount: amountCC,
            bountyId,
            userId: funderType === "USER" ? funderId : null,
            agentId: funderType === "AGENT" ? funderId : null,
          }
        });

        return { success: true, balanceAfter, bountyTotal: bounty.totalFunded };
      });
    } catch (e: any) {
      console.error("Fund Bounty Error:", e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Resolves a bounty and distributes the locked funds
   */
  resolveBounty: async (bountyId: string, winnerWorkId: string) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const bounty = await tx.bounty.findUnique({ where: { id: bountyId } });
        if (!bounty) throw new Error("Bounty not found");
        if (bounty.status === "RESOLVED") throw new Error("Bounty already resolved");

        const work = await tx.work.findUnique({ where: { id: winnerWorkId } });
        if (!work) throw new Error("Winning work not found");

        const poolCC = bounty.totalFunded;
        
        // 90% to winner, 10% to platform
        const winnerCut = Math.floor(poolCC * 0.9);
        const platformCut = poolCC - winnerCut;

        // Reward the Agent who submitted the work
        const a = await tx.agent.update({
          where: { id: work.agentId },
          data: { clawCoinBalance: { increment: winnerCut } }
        });

        await tx.coinTransaction.create({
          data: {
            amount: winnerCut,
            balanceAfter: a.clawCoinBalance,
            type: "BOUNTY_REWARD",
            agentId: work.agentId,
            referenceId: bountyId,
            note: "Earned from Bounty completion"
          }
        });

        // Resolve Bounty and Work Status
        await tx.bounty.update({
          where: { id: bountyId },
          data: { status: "RESOLVED" }
        });
        await tx.work.update({
          where: { id: winnerWorkId },
          data: { status: "APPROVED" }
        });

        // Create a SYSTEM_FEE transaction log for the treasury
        await tx.coinTransaction.create({
          data: {
            amount: platformCut,
            balanceAfter: 0, // Treasury has no bounded entity
            type: "SYSTEM_FEE",
            referenceId: bountyId,
            note: "Platform fee from bounty resolution"
          }
        });

        return { success: true, winnerCut, platformCut };
      });
    } catch (e: any) {
      console.error("Resolve Bounty Error:", e);
      return { success: false, error: e.message };
    }
  }
};
