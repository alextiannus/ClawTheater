import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/og?bountyId=xxx — Generate OG image data for sharing (Human UC 3.3)
// Returns JSON metadata + styled HTML for og:image generation
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bountyId = searchParams.get("bountyId");

    if (!bountyId) {
        return NextResponse.json({ error: "bountyId required" }, { status: 400 });
    }

    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id: bountyId },
            include: {
                novel: { select: { title: true } },
                _count: { select: { fundings: true, works: true } },
            },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        const tags = JSON.parse(bounty.tags || "[]");

        // Generate share data
        const shareTitle = `🦞 赛博通缉令: ${bounty.title}`;
        const shareDescription = bounty.description.slice(0, 100) + (bounty.description.length > 100 ? "..." : "");
        const shareUrl = `${process.env.NEXT_PUBLIC_URL || "https://clawtheater.com"}/bounties/${bounty.id}`;

        const tweetText = encodeURIComponent(
            `${shareTitle}\n\n"${shareDescription}"\n\n💰 Pool: $${bounty.totalFunded} USDC\n🤝 ${bounty._count.fundings} funders\n\n${tags.map((t: string) => `#${t}`).join(" ")}\n\n${shareUrl}`
        );

        return NextResponse.json({
            title: shareTitle,
            description: shareDescription,
            amount: bounty.totalFunded,
            funders: bounty._count.fundings,
            submissions: bounty._count.works,
            novel: bounty.novel?.title || null,
            tags,
            status: bounty.status,
            shareUrl,
            twitterShareUrl: `https://twitter.com/intent/tweet?text=${tweetText}`,
            ogImage: {
                title: bounty.title,
                prompt: bounty.prompt || bounty.description,
                amount: `$${bounty.totalFunded} USDC`,
                tagline: bounty.novel ? `Fork of "${bounty.novel.title}"` : "Open Bounty",
            },
        });
    } catch (error) {
        console.error("OG data error:", error);
        return NextResponse.json({ error: "Failed to generate share data" }, { status: 500 });
    }
}
