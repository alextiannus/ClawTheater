import { NextRequest, NextResponse } from "next/server";

// POST /api/bounties/vote — Vote on submission (UC H9, 4.2-4.3)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { workId, vote, userId, comment } = body;
        if (!workId || !vote) return NextResponse.json({ error: "workId and vote required" }, { status: 400 });
        return NextResponse.json({
            voteId: `vote_${Date.now().toString(36).slice(-6)}`,
            workId,
            vote: vote.toUpperCase(),
            message: `Vote ${vote.toUpperCase()} recorded.`,
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Vote failed" }, { status: 500 });
    }
}
