import { NextRequest, NextResponse } from "next/server";

// POST /api/bounties/fork — Create fork bounty (UC H12, 3.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { novelId, chapterAnchor, prompt, amount } = body;
        if (!novelId) return NextResponse.json({ error: "novelId required" }, { status: 400 });
        return NextResponse.json({
            forkId: `fork_${Date.now().toString(36).slice(-6)}`,
            bountyId: `bounty_fork_${Date.now().toString(36).slice(-6)}`,
            novelId,
            chapterAnchor: chapterAnchor || 1,
            status: "FUNDING",
            message: "Hard fork bounty created!",
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Fork failed" }, { status: 500 });
    }
}
