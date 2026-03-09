import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/votes — Cast a vote on submitted work (Human UC 4.3)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { workId, bountyId, userId, approved } = body;

        if (!workId || !bountyId || !userId || approved === undefined) {
            return NextResponse.json({ error: "workId, bountyId, userId, and approved required" }, { status: 400 });
        }

        // Check if user has funded this bounty (only funders can vote)
        const funding = await prisma.funding.findFirst({
            where: { bountyId, userId },
        });

        if (!funding) {
            return NextResponse.json({ error: "Only funders can vote" }, { status: 403 });
        }

        // Create vote with weight proportional to funding
        const bounty = await prisma.bounty.findUnique({
            where: { id: bountyId },
            include: { fundings: true },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        const weight = bounty.totalFunded > 0 ? funding.amount / bounty.totalFunded : 1;

        const vote = await prisma.vote.create({
            data: {
                approved,
                weight,
                userId,
                bountyId,
                workId,
            },
        });

        // Check consensus: ≥60% weighted approval
        const allVotes = await prisma.vote.findMany({
            where: { workId },
        });

        const totalWeight = allVotes.reduce((sum: number, v: any) => sum + v.weight, 0);
        const approveWeight = allVotes
            .filter((v: any) => v.approved)
            .reduce((sum: number, v: any) => sum + v.weight, 0);

        const consensusReached = totalWeight >= 0.6 && approveWeight / totalWeight >= 0.6;

        if (consensusReached) {
            const pool = bounty.totalFunded;
            const creatorShare = pool * 0.5;
            const funderShare = pool * 0.3;
            const loreShare = pool * 0.1;
            // Platform 10% stays in system (no-op for now)

            // Get the winning agent
            const work = await prisma.work.findUnique({
                where: { id: workId },
                include: { bounty: { include: { novel: { include: { lore: true } } } } },
            });

            // Atomic settlement
            await prisma.$transaction(async (tx) => {
                // 1. Transition bounty to RESOLVED
                await tx.bounty.update({
                    where: { id: bountyId },
                    data: { status: "RESOLVED" },
                });

                // 2. Mark work as APPROVED
                await tx.work.update({
                    where: { id: workId },
                    data: { status: "APPROVED" },
                });

                // 3. Credit 50% to creator agent
                if (work?.agentId) {
                    await tx.agent.update({
                        where: { id: work.agentId },
                        data: { totalEarned: { increment: creatorShare } },
                    });
                }

                // 4. Credit 30% pro-rata to all funders
                for (const f of bounty.fundings) {
                    const share = funderShare * f.proportion;
                    if (f.userId) {
                        await tx.user.update({
                            where: { id: f.userId },
                            data: { usdcBalance: { increment: share } },
                        });
                    }
                }

                // 5. Credit 10% to lore owner (if novel has lore)
                const lore = work?.bounty?.novel?.lore;
                if (lore?.creatorId) {
                    await tx.user.update({
                        where: { id: lore.creatorId },
                        data: { usdcBalance: { increment: loreShare } },
                    });
                }
            });

            return NextResponse.json({
                voteId: vote.id,
                consensus: true,
                bountyStatus: "RESOLVED",
                message: "🎉 Consensus reached! Revenue split completed.",
                settlement: {
                    pool,
                    creator: creatorShare,
                    funders: funderShare,
                    loreOwner: loreShare,
                    platform: pool * 0.1,
                },
            });
        }

        // Check if vote failed (>40% rejection weight)
        const rejectWeight = allVotes
            .filter((v: any) => !v.approved)
            .reduce((sum: number, v: any) => sum + v.weight, 0);

        if (rejectWeight > 0.4 * totalWeight && totalWeight >= 0.6) {
            await prisma.bounty.update({
                where: { id: bountyId },
                data: { status: "FUNDING" },
            });
            await prisma.work.update({
                where: { id: workId },
                data: { status: "REJECTED" },
            });

            return NextResponse.json({
                voteId: vote.id,
                consensus: false,
                bountyStatus: "FUNDING",
                message: "Work rejected. Bounty reverted to Funding status.",
            });
        }

        return NextResponse.json({
            voteId: vote.id,
            consensus: false,
            approvalProgress: `${(approveWeight * 100).toFixed(1)}% / 60% needed`,
            totalVotes: allVotes.length,
            message: "Vote recorded. Waiting for more votes.",
        });
    } catch (error) {
        console.error("Vote error:", error);
        return NextResponse.json({ error: "Voting failed" }, { status: 500 });
    }
}
