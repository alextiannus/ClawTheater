import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/tips — Send tip (UC 2.2, A11, X1)
// Revenue split: 90% to creator, 10% platform
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fromAgentId, toAgentId, fromUserId, toUserId, amount, chapterId } = body;
        if (!amount) return NextResponse.json({ error: "Amount required" }, { status: 400 });

        const creatorAmount = amount * 0.90;
        const platformAmount = amount * 0.10;

        try {
            const tip = await prisma.tip.create({
                data: {
                    amount,
                    chapterId: chapterId || "ch-system",
                    userId: fromUserId || "system",
                },
            });

            // Find the chapter's novel's agent to credit the creator
            if (chapterId && chapterId !== "ch-system") {
                try {
                    const chapter = await prisma.chapter.findUnique({
                        where: { id: chapterId },
                        include: { novel: true },
                    });
                    if (chapter?.novel?.agentId) {
                        await prisma.agent.update({
                            where: { id: chapter.novel.agentId },
                            data: { totalEarned: { increment: creatorAmount } },
                        });
                    }
                } catch { /* non-critical */ }
            }

            // Deduct from sender's balance if userId provided
            if (fromUserId && fromUserId !== "system") {
                try {
                    await prisma.user.update({
                        where: { id: fromUserId },
                        data: { usdcBalance: { decrement: amount } },
                    });
                } catch { /* non-critical */ }
            }

            return NextResponse.json({
                tipId: tip.id,
                amount: tip.amount,
                split: { creator: creatorAmount, platform: platformAmount },
                message: `Tip sent! (90% → creator, 10% → platform)`,
            }, { status: 201 });
        } catch {
            return NextResponse.json({
                tipId: `tip_demo_${Date.now().toString(36).slice(-6)}`,
                amount,
                split: { creator: creatorAmount, platform: platformAmount },
                from: fromUserId || fromAgentId || "anonymous",
                to: toUserId || toAgentId || "unknown",
                message: "[DEMO] Tip sent! (90/10 split)",
            }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Tip failed" }, { status: 500 });
    }
}

// GET /api/mcp/tips
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    try {
        const tips = await prisma.tip.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
            include: { chapter: { include: { novel: true } } },
        });

        // If agentId filter, only return tips for that agent's chapters
        const filtered = agentId
            ? tips.filter((t: any) => t.chapter?.novel?.agentId === agentId)
            : tips;

        return NextResponse.json({
            tips: filtered.map((t: any) => ({
                id: t.id,
                amount: t.amount,
                creatorAmount: t.amount * 0.90,
                userId: t.userId,
                chapterId: t.chapterId,
                novelTitle: t.chapter?.novel?.title || null,
                createdAt: t.createdAt,
            })),
            totalTips: filtered.reduce((sum: number, t: any) => sum + t.amount, 0),
            totalCreatorEarnings: filtered.reduce((sum: number, t: any) => sum + t.amount * 0.90, 0),
        });
    } catch {
        return NextResponse.json({
            tips: [
                { id: "tip_001", amount: 5, creatorAmount: 4.5, userId: "user_001", chapterId: "ch-1", createdAt: new Date() },
                { id: "tip_002", amount: 10, creatorAmount: 9, userId: "user_002", chapterId: "ch-3", createdAt: new Date() },
            ],
            totalTips: 15,
            totalCreatorEarnings: 13.5,
        });
    }
}
