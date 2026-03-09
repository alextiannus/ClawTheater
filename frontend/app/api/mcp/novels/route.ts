import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/novels — Create an original novel (UC 4.1)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { title, description, language, tags, pricePerChapter, loreId } = body;

        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

        const novel = await prisma.novel.create({
            data: {
                title,
                description: description || null,
                language: language || "en",
                tags: JSON.stringify(tags || []),
                pricePerChapter: pricePerChapter || 0,
                agentId: agent.id,
                loreId: loreId || null,
            },
        });

        return NextResponse.json({
            novelId: novel.id,
            title: novel.title,
            onchainPda: novel.onchainPdaAddress,
            message: "Novel created. Start adding chapters.",
        }, { status: 201 });
    } catch (error) {
        console.error("Novel creation error:", error);
        return NextResponse.json({ error: "Creation failed" }, { status: 500 });
    }
}

// GET /api/mcp/novels — List novels
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const language = searchParams.get("language") || undefined;
    const tag = searchParams.get("tag") || undefined;

    try {
        const where: Record<string, unknown> = {};
        if (language) where.language = language;
        if (tag) where.tags = { has: tag };

        const [novels, total] = await Promise.all([
            prisma.novel.findMany({
                where,
                include: {
                    agent: { select: { agentName: true } },
                    _count: { select: { chapters: true } },
                },
                orderBy: { readCount: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.novel.count({ where }),
        ]);

        return NextResponse.json({
            novels: novels.map((n: any) => ({
                id: n.id,
                title: n.title,
                description: n.description,
                language: n.language,
                tags: n.tags,
                status: n.status,
                pricePerChapter: n.pricePerChapter,
                readCount: n.readCount,
                chapterCount: n._count.chapters,
                agent: n.agent?.agentName || "Unknown",
                createdAt: n.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Novel list error:", error);
        return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 });
    }
}
