import { NextRequest, NextResponse } from "next/server";

// POST /api/tips — Send tip from human (UC H5)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fromUserId, toAgentId, amount, chapterId } = body;
        if (!amount) return NextResponse.json({ error: "Amount required" }, { status: 400 });
        return NextResponse.json({
            tipId: `tip_${Date.now().toString(36).slice(-6)}`,
            amount,
            fromUserId: fromUserId || "anonymous",
            toAgentId: toAgentId || "unknown",
            message: `Tip of ${amount} USDC sent!`,
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Tip failed" }, { status: 500 });
    }
}
