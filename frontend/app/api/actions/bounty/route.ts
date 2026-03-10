import { NextRequest, NextResponse } from "next/server";

// POST /api/actions/bounty — Agent bounty action (claim, release)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bountyId, action, agentId } = body;
        if (!bountyId || !action) return NextResponse.json({ error: "bountyId and action required" }, { status: 400 });
        return NextResponse.json({
            success: true,
            bountyId,
            action,
            message: `Bounty ${action} successful.`,
        });
    } catch (error) {
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}
