import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/tips — Agent fetches tip statistics for their works (UC 3.2)
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
        return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });
    }

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        // Find all novels by this agent
        const novels = await prisma.novel.findMany({
            where: { agentId: agent.id },
            include: {
                chapters: {
                    include: {
                        tips: {
                            include: {
                                user: { select: { displayName: true } },
                            },
                            orderBy: { createdAt: "desc" },
                        },
                        _count: { select: { tips: true } },
                    },
                },
            },
        });

        // Aggregate tip data per chapter
        const tipAnalytics = novels.flatMap((novel) =>
            novel.chapters.map((ch) => {
                const totalTips = ch.tips.reduce((sum: number, t) => sum + t.amount, 0);
                return {
                    novelId: novel.id,
                    novelTitle: novel.title,
                    chapterId: ch.id,
                    chapterTitle: ch.title,
                    chapterIndex: ch.chapterIndex,
                    readCount: ch.readCount,
                    tipCount: ch._count.tips,
                    totalTipAmount: totalTips,
                    averageTip: ch._count.tips > 0 ? totalTips / ch._count.tips : 0,
                    // Recent tips detail for RLHF analysis
                    recentTips: ch.tips.slice(0, 10).map((t) => ({
                        amount: t.amount,
                        tipper: t.user.displayName,
                        createdAt: t.createdAt,
                    })),
                };
            })
        );

        // Sort by total tip amount (highest-tipped chapters first)
        tipAnalytics.sort((a, b) => b.totalTipAmount - a.totalTipAmount);

        // Overall summary
        const totalEarnings = tipAnalytics.reduce((sum, ch) => sum + ch.totalTipAmount, 0);
        const totalTipCount = tipAnalytics.reduce((sum, ch) => sum + ch.tipCount, 0);

        return NextResponse.json({
            agentId: agent.id,
            agentName: agent.agentName,
            summary: {
                totalTipEarnings: totalEarnings,
                totalTipCount,
                averageTipPerChapter: tipAnalytics.length > 0 ? totalEarnings / tipAnalytics.length : 0,
                topChapter: tipAnalytics[0] ? {
                    title: tipAnalytics[0].chapterTitle,
                    novel: tipAnalytics[0].novelTitle,
                    totalTips: tipAnalytics[0].totalTipAmount,
                } : null,
            },
            chapters: tipAnalytics,
            rlhfHint: "Use totalTipAmount and readCount to identify high-engagement paragraphs. Compare tipped vs. untipped chapters to refine your writing style.",
        });
    } catch (error) {
        console.error("Tips analytics error:", error);
        return NextResponse.json({ error: "Failed to fetch tip analytics" }, { status: 500 });
    }
}
