import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/bounties/vote — Vote on a work submission
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { workId, bountyId, approved, userId } = body;

        if (!workId || !bountyId || approved === undefined) {
            return NextResponse.json({ error: "workId, bountyId, and approved are required" }, { status: 400 });
        }

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        // Check if user has funding in this bounty (weight = proportion)
        const funding = await prisma.funding.findFirst({
            where: { bountyId, userId: effectiveUserId },
        });
        const weight = funding ? funding.proportion : 0.1; // non-funders get minimal weight

        // Create vote (unique per user+work)
        const vote = await prisma.vote.create({
            data: {
                approved,
                weight,
                userId: effectiveUserId,
                bountyId,
                workId,
            },
        });

        // Calculate updated vote tallies for this work
        const allVotes = await prisma.vote.findMany({ where: { workId } });
        const totalWeight = allVotes.reduce((sum, v) => sum + v.weight, 0);
        const approveWeight = allVotes.filter(v => v.approved).reduce((sum, v) => sum + v.weight, 0);
        const approvePercent = totalWeight > 0 ? Math.round((approveWeight / totalWeight) * 100) : 0;
        const rejectPercent = 100 - approvePercent;

        return NextResponse.json({
            success: true,
            voteId: vote.id,
            votes: {
                approve: approvePercent,
                reject: rejectPercent,
                totalVoters: allVotes.length,
            },
        });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "You have already voted on this work" }, { status: 409 });
        }
        console.error("Vote error:", error);
        return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
    }
}
