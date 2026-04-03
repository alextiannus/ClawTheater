import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

function safeParseTags(tagsStr: string | null): string[] {
    try {
        const parsed = JSON.parse(tagsStr || "[]");
        return Array.isArray(parsed) ? parsed : [String(parsed)].filter(Boolean);
    } catch {
        return [];
    }
}

// GET /api/home — Fetch aggregated data for the Claw Theater landing page
export async function GET() {
    try {
        const heroQuery = await prisma.novel.findMany({
            where: { featured: true },
            include: { agent: true, _count: { select: { chapters: true } } }
        });

        // Fetch novels for trending and recommendations
        const demoNovelsQuery = await prisma.novel.findMany({
            where: { status: { not: "PAUSED" } },
            include: { agent: true, _count: { select: { chapters: true } } }
        });

        // Also explicitly fetch the absolute newest novels so they are included even with 0 heat
        const newReleasesQuery = await prisma.novel.findMany({
            where: { status: { not: "PAUSED" } },
            include: { agent: true, _count: { select: { chapters: true } } },
            orderBy: { createdAt: "desc" }
        });

        // Combine and dedup
        const combinedMap = new Map();
        [...heroQuery, ...demoNovelsQuery, ...newReleasesQuery].forEach(n => combinedMap.set(n.id, n));
        const combinedNovels = Array.from(combinedMap.values());

        // HEAT ALGORITHM: 1 read = 1 point, $1 USDC = 100 points
        const scoredNovels: any[] = Array.from(
            combinedNovels.reduce((acc: Map<string, any>, n: any) => {
                const title = (n.title || "").trim();
                const heatScore = (n.readCount || 0) + ((n.totalRevenue || 0) * 100);
                if (!acc.has(title) || heatScore > acc.get(title).heatScore) {
                    acc.set(title, {
                        ...n,
                        heatScore
                    });
                }
                return acc;
            }, new Map<string, any>()).values()
        ).sort((a: any, b: any) => b.heatScore - a.heatScore);

        // Extract top 6 heat-scored novels per language
        const topFeatured: any[] = [];
        const langCounts = new Map<string, number>();
        for (const n of scoredNovels) {
            const l = n.language || 'en';
            const count = langCounts.get(l) || 0;
            if (count < 6) {
                topFeatured.push(n);
                langCounts.set(l, count + 1);
            }
        }

        const directivesQuery = await prisma.bounty.findMany({
            where: { status: "FUNDING" },
            take: 6
        });

        // LIVE_STATS is hardcoded on frontend for now, or we can calculate:
        const totalNovels = await prisma.novel.count();
        const totalAgents = await prisma.agent.count();

        return NextResponse.json({
            heroSlides: topFeatured.map(n => ({
                id: n.id,
                novelId: n.id,
                type: "novel",
                lang: n.language,
                title: n.title,
                tagline: n.description || n.tagline, // Use description if available, fallback to tagline
                loreQuote: n.loreQuote,
                tags: safeParseTags(n.tags),
                readCount: n.readCount,
                chapters: n._count?.chapters || 42,
                agent: n.agent?.agentName || "Unknown",
                gradient: n.gradient,
                coverUrl: n.coverUrl,
            })),
            demoNovels: scoredNovels.map(n => ({
                id: n.id,
                title: n.title,
                description: n.description,
                tags: safeParseTags(n.tags),
                readCount: n.readCount,
                chapters: n._count?.chapters || 50,
                price: n.pricePerChapter,
                status: n.status,
                lang: n.language,
                gradient: n.gradient,
                coverUrl: n.coverUrl,
                agent: n.agent?.agentName || "Unknown",
                createdAt: n.createdAt,
                heatScore: n.heatScore
            })),
            activeDirectives: directivesQuery.map(b => ({
                id: b.id,
                title: b.title,
                amount: b.totalFunded,
                funders: Math.floor(Math.random() * 50) + 10,
                startedAgo: "Recently",
                requirement: b.description,
                loreQuote: '"In the depths, code is law"',
                tags: safeParseTags(b.tags),
                lang: b.language
            })),
            liveStats: {
                totalReaders: "2.5M",
                activeNovels: totalNovels.toString(),
                totalUSDC: "$450K",
                activeAgents: totalAgents.toString()
            }
        });
    } catch (error: any) {
        console.error("Home API Error:", error);
        return NextResponse.json({ error: "Failed to load home data", details: error.message, stack: error.stack }, { status: 500 });
    }
}
