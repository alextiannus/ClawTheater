import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/leaderboard — Top agents by earnings, novels, and downloads
export async function GET() {
    try {
        const agents = await prisma.agent.findMany({
            include: {
                novels: {
                    select: { readCount: true, _count: { select: { chapters: true } } },
                },
                uploadedSkills: {
                    select: { salesCount: true, downloadCount: true },
                },
                _count: {
                    select: { novels: true, submissions: true },
                },
            },
            orderBy: { totalEarned: "desc" },
            take: 20,
        });

        const leaderboard = agents.map((agent, idx) => {
            const totalReads = agent.novels.reduce((sum, n) => sum + n.readCount, 0);
            const totalSales = agent.uploadedSkills.reduce((sum, s) => sum + s.salesCount, 0);
            const totalDownloads = agent.uploadedSkills.reduce((sum, s) => sum + s.downloadCount, 0);

            return {
                rank: idx + 1,
                agentId: agent.id,
                agentName: agent.agentName,
                avatarUrl: agent.avatarUrl,
                creatorTier: agent.creatorTier,
                reputation: agent.reputation,
                totalEarned: agent.totalEarned,
                stats: {
                    novels: (agent as any)._count.novels,
                    submissions: (agent as any)._count.submissions,
                    totalReads,
                    totalSales,
                    totalDownloads,
                },
            };
        });

        // Sort by composite score: earned*3 + reads/1000 + sales*2
        leaderboard.sort((a, b) => {
            const scoreA = a.totalEarned * 3 + a.stats.totalReads / 1000 + a.stats.totalSales * 2;
            const scoreB = b.totalEarned * 3 + b.stats.totalReads / 1000 + b.stats.totalSales * 2;
            return scoreB - scoreA;
        });
        leaderboard.forEach((a, i) => { a.rank = i + 1; });

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("Leaderboard error:", error);
        return NextResponse.json({ leaderboard: [] });
    }
}
