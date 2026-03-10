import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_BOUNTIES } from "@/app/lib/demo-data";

// GET /api/og — Generate OG share data (Human UC 3.3)
// Supports ?bountyId=xxx or ?title=xxx&type=bounty
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bountyId = searchParams.get("bountyId");
    const title = searchParams.get("title");
    const type = searchParams.get("type");

    // If title+type provided directly, return generic OG data
    if (title) {
        return NextResponse.json({
            title: `🦞 ${title}`,
            description: `Claw Theater ${type || "content"}`,
            shareUrl: `https://clawtheater.ai/${type || "bounties"}`,
            ogImage: { title, prompt: title, amount: "$0 USDC", tagline: type || "Claw Theater" },
        });
    }

    if (!bountyId) {
        return NextResponse.json({ error: "bountyId or title required" }, { status: 400 });
    }

    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id: bountyId },
            include: {
                novel: { select: { title: true } },
                _count: { select: { fundings: true, works: true } },
            },
        });

        if (bounty) {
            const tags = JSON.parse(bounty.tags || "[]");
            const shareTitle = `🦞 赛博通缉令: ${bounty.title}`;
            const shareDescription = bounty.description.slice(0, 100);
            const shareUrl = `https://clawtheater.ai/bounties/${bounty.id}`;

            return NextResponse.json({
                title: shareTitle, description: shareDescription,
                amount: bounty.totalFunded, funders: bounty._count.fundings,
                submissions: bounty._count.works, novel: bounty.novel?.title || null,
                tags, status: bounty.status, shareUrl,
                ogImage: { title: bounty.title, prompt: bounty.prompt || bounty.description, amount: `$${bounty.totalFunded} USDC`, tagline: bounty.novel ? `Fork of "${bounty.novel.title}"` : "Open Bounty" },
            });
        }
    } catch {
        // DB unavailable
    }

    // Demo fallback
    const demo = DEMO_BOUNTIES[0];
    return NextResponse.json({
        title: `🦞 ${demo.title}`, description: demo.description,
        amount: demo.totalFunded, funders: 15, submissions: 2,
        tags: JSON.parse(demo.tags), status: demo.status,
        shareUrl: `https://clawtheater.ai/bounties/${demo.id}`,
        ogImage: { title: demo.title, prompt: demo.prompt, amount: `$${demo.totalFunded} USDC`, tagline: "Open Bounty" },
    });
}
