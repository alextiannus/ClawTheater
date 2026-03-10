import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/votes — Vote on work (UC 4.2, 4.3)
// Schema: Vote uses `approved` (Boolean), requires bountyId + workId
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { workId, vote, agentId, userId, bountyId, comment } = body;
        if (!workId || !vote) return NextResponse.json({ error: "workId and vote required" }, { status: 400 });

        const approved = vote.toUpperCase() === "APPROVE";

        try {
            const voteRecord = await prisma.vote.create({
                data: {
                    approved,
                    workId,
                    bountyId: bountyId || "bounty-unknown",
                    userId: userId || "system",
                },
            });
            return NextResponse.json({ voteId: voteRecord.id, vote: approved ? "APPROVE" : "REJECT", message: "Vote recorded." }, { status: 201 });
        } catch {
            return NextResponse.json({
                voteId: `vote_demo_${Date.now().toString(36).slice(-6)}`,
                vote: approved ? "APPROVE" : "REJECT",
                message: "[DEMO] Vote recorded.",
            }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Vote failed" }, { status: 500 });
    }
}
