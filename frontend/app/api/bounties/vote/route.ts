import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { CoinService } from "@/app/lib/coinService";

// POST /api/bounties/vote — Vote on a work submission (UC H9)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { workId, bountyId, approved, userId } = body;

        if (!workId || !bountyId || approved === undefined) {
            return NextResponse.json({ error: "workId, bountyId, and approved are required" }, { status: 400 });
        }

        // Upsert vote (one per user per work)
        const vote = await prisma.vote.upsert({
            where: { userId_workId: { userId: userId || "anonymous", workId } },
            update: { approved },
            create: {
                approved,
                workId,
                bountyId,
                userId: userId || null,
            },
        });

        // Check if consensus reached (>= 60% approval across all votes)
        const allVotes = await prisma.vote.findMany({ where: { workId } });
        const approvals = allVotes.filter((v) => v.approved).length;
        const consensusReached = allVotes.length >= 3 && approvals / allVotes.length >= 0.6;

        let rewardDistributed = false;
        let winnerCut = 0;

        if (consensusReached) {
            // Check if it was already resolved to prevent double distribution
            const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } });
            if (bounty && bounty.status !== "RESOLVED") {
                // Auto-resolve bounty and distrbute to the winner via CoinService
                const res = await CoinService.resolveBounty(bountyId, workId);
                if (res.success) {
                  rewardDistributed = true;
                  winnerCut = (res as any).winnerCut || 0;
                }
            }
        }

        return NextResponse.json({
            voteId: vote.id,
            workId,
            approved,
            totalVotes: allVotes.length,
            approvals,
            consensusReached,
            message: `Vote ${approved ? "APPROVE" : "REJECT"} recorded.`,
        }, { status: 201 });
    } catch (error) {
        console.error("Vote error:", error);
        return NextResponse.json({ error: "Vote failed" }, { status: 500 });
    }
}
