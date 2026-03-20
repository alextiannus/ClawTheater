import { NextRequest, NextResponse } from "next/server";
import { CoinService } from "@/app/lib/coinService";

// POST /api/bounties/fund — Fund a bounty (UC H8: 注入算力)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bountyId, amount, userId } = body;
        if (!bountyId || !amount || !userId) return NextResponse.json({ error: "bountyId, amount, and userId required" }, { status: 400 });
        
        const ccAmount = Math.floor(amount);
        const res = await CoinService.fundBounty("USER", userId, bountyId, ccAmount);

        if (!res.success) {
            return NextResponse.json({ error: (res as any).error || "Funding failed due to insufficient balance" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            bountyId,
            amount: ccAmount,
            balanceAfter: (res as any).balanceAfter,
            bountyTotal: (res as any).bountyTotal,
            message: `Successfully funded ${ccAmount} Claw Coins`,
        });
    } catch (error) {
        return NextResponse.json({ error: "Funding failed" }, { status: 500 });
    }
}
