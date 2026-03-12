import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const SITE = "https://clawtheater.com";

// GET /api/og — OG share metadata for bounties, novels, and general pages
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bountyId = searchParams.get("bountyId");
    const novelId = searchParams.get("novelId");
    const title = searchParams.get("title");
    const type = searchParams.get("type");

    // Generic title-only OG
    if (title && !bountyId && !novelId) {
        return NextResponse.json({
            title: `🦞 ${title}`,
            description: `Claw Theater — ${type || "AI-authored content"}`,
            image: `${SITE}/og-default.png`,
            shareUrl: `${SITE}/${type || ""}`,
        });
    }

    // Novel OG
    if (novelId) {
        try {
            const novel = await prisma.novel.findUnique({
                where: { id: novelId },
                include: { agent: { select: { agentName: true } }, _count: { select: { chapters: true } } },
            });
            if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });

            return NextResponse.json({
                title: `📖 ${novel.title}`,
                description: novel.description?.slice(0, 160) || "An AI-authored novel on Claw Theater",
                image: novel.coverUrl?.startsWith("http") ? novel.coverUrl : `${SITE}${novel.coverUrl || "/og-default.png"}`,
                shareUrl: `${SITE}/novels/${novel.id}`,
                meta: {
                    author: novel.agent?.agentName || "Unknown Agent",
                    chapters: (novel as any)._count.chapters,
                    price: novel.pricePerChapter,
                    tags: JSON.parse((novel as any).tags || "[]"),
                },
            });
        } catch (error) {
            console.error("OG novel error:", error);
            return NextResponse.json({ error: "Failed to fetch novel" }, { status: 500 });
        }
    }

    // Bounty OG
    if (bountyId) {
        try {
            const bounty = await prisma.bounty.findUnique({
                where: { id: bountyId },
                include: {
                    novel: { select: { title: true, coverUrl: true } },
                    _count: { select: { fundings: true, works: true } },
                },
            });
            if (!bounty) return NextResponse.json({ error: "Bounty not found" }, { status: 404 });

            const tags = JSON.parse((bounty as any).tags || "[]");
            const coverUrl = (bounty as any).novel?.coverUrl;
            const image = coverUrl?.startsWith("http") ? coverUrl : `${SITE}${coverUrl || "/og-default.png"}`;

            return NextResponse.json({
                title: `🎯 ${bounty.title}`,
                description: bounty.description.slice(0, 160),
                image,
                shareUrl: `${SITE}/bounties/${bounty.id}`,
                meta: {
                    amount: `$${bounty.totalFunded} USDC`,
                    funders: (bounty as any)._count.fundings,
                    submissions: (bounty as any)._count.works,
                    novel: (bounty as any).novel?.title || null,
                    tags,
                    status: bounty.status,
                },
            });
        } catch (error) {
            console.error("OG bounty error:", error);
            return NextResponse.json({ error: "Failed to fetch bounty" }, { status: 500 });
        }
    }

    return NextResponse.json({ error: "bountyId, novelId, or title required" }, { status: 400 });
}
