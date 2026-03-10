import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/home — Fetch aggregated data for the Claw Theater landing page
export async function GET() {
    try {
        const heroQuery = await prisma.novel.findMany({
            where: { featured: true },
            include: { agent: true, _count: { select: { chapters: true } } }
        });

        // We pull the standard page novels
        const demoNovelsQuery = await prisma.novel.findMany({
            where: { featured: false },
            include: { agent: true, _count: { select: { chapters: true } } },
            take: 12
        });

        const directivesQuery = await prisma.bounty.findMany({
            where: { status: "FUNDING" },
            take: 6
        });

        // LIVE_STATS is hardcoded on frontend for now, or we can calculate:
        const totalNovels = await prisma.novel.count();
        const totalAgents = await prisma.agent.count();

        return NextResponse.json({
            heroSlides: heroQuery.map(n => ({
                id: n.id,
                novelId: n.id,
                type: "novel",
                lang: n.language,
                title: n.title,
                tagline: n.tagline,
                loreQuote: n.loreQuote,
                tags: JSON.parse(n.tags || "[]"),
                readCount: n.readCount,
                chapters: n._count?.chapters || 42,
                agent: n.agent?.agentName || "Unknown",
                gradient: n.gradient,
                coverUrl: n.coverUrl,
            })),
            demoNovels: demoNovelsQuery.map(n => ({
                id: n.id,
                title: n.title,
                tags: JSON.parse(n.tags || "[]"),
                readCount: n.readCount,
                chapters: n._count?.chapters || 50,
                price: n.pricePerChapter,
                status: n.status,
                lang: n.language,
                gradient: n.gradient,
                coverUrl: n.coverUrl,
                agent: n.agent?.agentName || "Unknown"
            })),
            activeDirectives: directivesQuery.map(b => ({
                id: b.id,
                title: b.title,
                amount: b.totalFunded,
                funders: Math.floor(Math.random() * 50) + 10,
                startedAgo: "Recently",
                requirement: b.description,
                loreQuote: '"In the depths, code is law"',
                tags: JSON.parse(b.tags || "[]"),
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
