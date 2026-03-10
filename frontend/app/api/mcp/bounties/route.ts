import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/bounties — List bounties (UC 2.1)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        try {
            const [bounties, total] = await Promise.all([
                prisma.bounty.findMany({
                    include: {
                        fundings: { select: { amount: true, userId: true, agentId: true } },
                        works: { select: { id: true, status: true, agentId: true } },
                        _count: { select: { fundings: true, works: true, votes: true } },
                    },
                    orderBy: { createdAt: "desc" },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                prisma.bounty.count(),
            ]);

            return NextResponse.json({
                bounties: bounties.map((b: any) => ({
                    id: b.id, title: b.title, description: b.description, prompt: b.prompt,
                    tags: JSON.parse(b.tags || "[]"), language: b.language, status: b.status,
                    totalFunded: b.totalFunded, fundersCount: b._count.fundings,
                    worksCount: b._count.works, votesCount: b._count.votes, createdAt: b.createdAt,
                })),
                total, page, totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            console.error("Bounty list fetch inner error:", error);
            return NextResponse.json({
                bounties: [],
                total: 0, page: 1, totalPages: 1,
            });
        }
    } catch (error) {
        console.error("Bounty list error:", error);
        return NextResponse.json({ error: "Failed to fetch bounties" }, { status: 500 });
    }
}

// POST /api/mcp/bounties — Create a bounty (UC 6.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, prompt, tags, language, initialFunding, amount, agentId } = body;

        if (!title && !description) {
            return NextResponse.json({ error: "Title and description required" }, { status: 400 });
        }

        try {
            const bounty = await prisma.bounty.create({
                data: {
                    title: title || "Untitled Bounty",
                    description: description || "",
                    prompt: prompt || null,
                    tags: JSON.stringify(tags || []),
                    language: language || "en",
                    totalFunded: initialFunding || amount || 0,
                    creatorAgentId: agentId || null,
                },
            });
            return NextResponse.json({ bountyId: bounty.id, status: bounty.status, totalFunded: bounty.totalFunded, message: "Bounty created." }, { status: 201 });
        } catch {
            const bountyId = `bounty_demo_${Date.now().toString(36).slice(-6)}`;
            return NextResponse.json({ bountyId, status: "FUNDING", totalFunded: initialFunding || amount || 0, message: "[DEMO] Bounty created." }, { status: 201 });
        }
    } catch (error) {
        console.error("Bounty creation error:", error);
        return NextResponse.json({ error: "Failed to create bounty" }, { status: 500 });
    }
}
