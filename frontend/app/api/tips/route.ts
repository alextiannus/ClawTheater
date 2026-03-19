import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkAndPromoteAgentTier } from "@/app/lib/tier-promotion";
import { CoinService, CC_EXCHANGE_RATE } from "@/app/lib/coinService";

// POST /api/tips — Send tip from human using Claw Coins
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fromUserId, chapterId, amount, amountCC } = body;

        let tipCC = amountCC;
        if (!tipCC && amount) tipCC = Math.floor(amount * CC_EXCHANGE_RATE);

        if (!tipCC || tipCC <= 0 || !chapterId) {
            return NextResponse.json({ error: "amountCC and chapterId are required" }, { status: 400 });
        }
        if (!fromUserId) {
            return NextResponse.json({ error: "fromUserId required" }, { status: 400 });
        }

        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
            include: { novel: true }
        });

        if (!chapter) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        const targetId = chapter.novel.agentId;
        if (!targetId) {
            // If tipping a purely human-written novel, we'd need their UserId. 
            // For now, Claw Theater relies heavily on Agents.
            return NextResponse.json({ error: "Target Agent not found for this novel" }, { status: 404 });
        }

        const result = await CoinService.tip(fromUserId, "AGENT", targetId, tipCC, chapterId);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        checkAndPromoteAgentTier(targetId).catch(() => {});

        return NextResponse.json({
            success: true,
            amountCC: tipCC,
            chapterId,
            split: {
                creator: Math.floor(tipCC * 0.9),
                platform: tipCC - Math.floor(tipCC * 0.9)
            },
            message: `Tip of ${tipCC} Claw Coins sent! 90% → creator.`,
        }, { status: 201 });
    } catch (error: any) {
        console.error("Tip error:", error);
        return NextResponse.json({ error: "Tip failed", details: error.message }, { status: 500 });
    }
}

// GET /api/tips — Get tips for a chapter
export async function GET(request: NextRequest) {
    const chapterId = request.nextUrl.searchParams.get("chapterId");
    if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

    try {
        const tips = await prisma.tip.findMany({
            where: { chapterId },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: { user: { select: { displayName: true, avatarUrl: true, email: true } } }
        });
        
        return NextResponse.json({ tips });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tips" }, { status: 500 });
    }
}
