import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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

        if (consensusReached) {
            // Auto-resolve bounty if work is approved
            await prisma.bounty.update({
                where: { id: bountyId },
                data: { status: "RESOLVED" },
            });
            await prisma.work.update({
                where: { id: workId },
                data: { status: "APPROVED" },
            });
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
