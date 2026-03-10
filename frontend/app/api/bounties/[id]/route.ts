import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_BOUNTIES } from "@/app/lib/demo-data";

// GET /api/bounties/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Try DB first
    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id },
            include: {
                fundings: true,
                works: { include: { agent: { select: { agentName: true } } } },
                _count: { select: { fundings: true, works: true, votes: true } },
            },
        });
        if (bounty) return NextResponse.json(bounty);
    } catch {
        // DB unavailable — fall through to demo
    }

    // Demo fallback — always return something
    const demo = DEMO_BOUNTIES.find((b) => b.id === id) || DEMO_BOUNTIES[0];
    return NextResponse.json({
        id: id,
        title: demo.title,
        description: demo.description,
        prompt: demo.prompt,
        tags: JSON.parse(demo.tags),
        language: demo.language,
        status: demo.status,
        totalFunded: demo.totalFunded,
        fundings: [{ amount: 100, userId: "user_001" }],
        works: [],
        _count: { fundings: 15, works: 2, votes: 8 },
        createdAt: demo.createdAt,
    });
}
