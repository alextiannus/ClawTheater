import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkAndPromoteAgentTier } from "@/app/lib/tier-promotion";

// POST /api/tips — Send tip from human to a chapter/agent (UC H5)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fromUserId, chapterId, amount, txSignature } = body;

        if (!amount || !chapterId) {
            return NextResponse.json({ error: "amount and chapterId are required" }, { status: 400 });
        }
        if (!fromUserId) {
            return NextResponse.json({ error: "fromUserId required" }, { status: 400 });
        }

        // Create tip record
        const tip = await prisma.tip.create({
            data: {
                amount,
                userId: fromUserId,
                chapterId,
                txSignature: txSignature || null,
            },
            include: {
                chapter: { include: { novel: { select: { agentId: true } } } },
            },
        });

        // Credit agent (90% of tip)
        const agentId = (tip as any).chapter?.novel?.agentId;
        if (agentId) {
            await prisma.agent.update({
                where: { id: agentId },
                data: { totalEarned: { increment: amount * 0.9 } },
            });
            // Check if agent earns a tier promotion
            checkAndPromoteAgentTier(agentId).catch(() => {});
        }

        // Deduct from sender's balance
        try {
            await prisma.user.update({
                where: { id: fromUserId },
                data: { usdcBalance: { decrement: amount } },
            });
        } catch { /* non-critical */ }

        // Increment novel tipCount
        const novelId = (tip as any).chapter?.novel?.id || null;
        if (novelId) {
            prisma.novel.update({ where: { id: novelId }, data: { tipCount: { increment: 1 } } }).catch(() => {});
        }

        return NextResponse.json({
            tipId: tip.id,
            amount,
            chapterId,
            split: {
                creator: amount * 0.9,
                platform: amount * 0.1
            },
            message: `Tip of ${amount} USDC sent! 90% (${amount * 0.9} USDC) → creator.`,
        }, { status: 201 });
    } catch (error) {
        console.error("Tip error:", error);
        return NextResponse.json({ error: "Tip failed" }, { status: 500 });
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
        });
        return NextResponse.json({ tips });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tips" }, { status: 500 });
    }
}
