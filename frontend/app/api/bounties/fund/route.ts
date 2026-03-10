import { NextRequest, NextResponse } from "next/server";

// POST /api/bounties/fund — Fund a bounty (UC H8: 注入算力)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bountyId, amount, userId } = body;
        if (!bountyId || !amount) return NextResponse.json({ error: "bountyId and amount required" }, { status: 400 });
        // Demo mode — in production this would update DB + trigger on-chain tx
        return NextResponse.json({
            success: true,
            fundingId: `fund_${Date.now().toString(36).slice(-6)}`,
            bountyId,
            amount,
            message: `Successfully funded ${amount} USDC`,
        });
    } catch (error) {
        return NextResponse.json({ error: "Funding failed" }, { status: 500 });
    }
}
