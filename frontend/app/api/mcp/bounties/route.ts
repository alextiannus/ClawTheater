import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/bounties — List bounties with filtering (UC 2.1: Radar scan)
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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || undefined;
        const minAmount = parseFloat(searchParams.get("minAmount") || "0");
        const maxAmount = parseFloat(searchParams.get("maxAmount") || "99999");
        const language = searchParams.get("language") || undefined;
        const tag = searchParams.get("tag") || undefined;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const where: Record<string, unknown> = {
            totalFunded: { gte: minAmount, lte: maxAmount },
        };
        if (status) where.status = status.toUpperCase();
        if (language) where.language = language;
        if (tag) where.tags = { contains: tag };

        const [bounties, total] = await Promise.all([
            prisma.bounty.findMany({
                where,
                include: {
                    fundings: { select: { amount: true, userId: true, agentId: true } },
                    works: { select: { id: true, status: true, agentId: true } },
                    _count: { select: { fundings: true, works: true, votes: true } },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.bounty.count({ where }),
        ]);

        return NextResponse.json({
            bounties: bounties.map((b: any) => ({
                id: b.id,
                title: b.title,
                description: b.description,
                prompt: b.prompt,
                tags: JSON.parse(b.tags || "[]"),
                language: b.language,
                status: b.status,
                totalFunded: b.totalFunded,
                blinksUrl: b.blinksUrl,
                onchainPda: b.onchainPdaAddress,
                fundersCount: b._count.fundings,
                worksCount: b._count.works,
                votesCount: b._count.votes,
                createdAt: b.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Bounty list error:", error);
        return NextResponse.json({ error: "Failed to fetch bounties" }, { status: 500 });
    }
}

// POST /api/mcp/bounties — Create a bounty (UC 6.1: Agent as employer)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
        return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });
    }

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, prompt, tags, language, initialFunding } = body;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description required" }, { status: 400 });
        }

        const bounty = await prisma.bounty.create({
            data: {
                title,
                description,
                prompt: prompt || null,
                tags: JSON.stringify(tags || []),
                language: language || "en",
                totalFunded: initialFunding || 0,
                creatorAgentId: agent.id,
            },
        });

        // If initial funding provided, create funding record
        if (initialFunding && initialFunding > 0) {
            await prisma.funding.create({
                data: {
                    amount: initialFunding,
                    proportion: 1.0,
                    agentId: agent.id,
                    bountyId: bounty.id,
                },
            });
        }

        return NextResponse.json({
            bountyId: bounty.id,
            status: bounty.status,
            totalFunded: bounty.totalFunded,
            message: "Bounty created successfully.",
        }, { status: 201 });
    } catch (error) {
        console.error("Bounty creation error:", error);
        return NextResponse.json({ error: "Failed to create bounty" }, { status: 500 });
    }
}
