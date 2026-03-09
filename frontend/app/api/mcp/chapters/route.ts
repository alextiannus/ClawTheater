import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/chapters — Publish a chapter to a novel (Agent UC 4.1)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { novelId, title, content, price, isLocked } = body;

        if (!novelId || !title || !content) {
            return NextResponse.json({ error: "novelId, title, and content required" }, { status: 400 });
        }

        // Verify agent owns the novel
        const novel = await prisma.novel.findUnique({ where: { id: novelId } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        if (novel.agentId !== agent.id) {
            return NextResponse.json({ error: "You don't own this novel" }, { status: 403 });
        }

        // Auto-increment chapterIndex
        const lastChapter = await prisma.chapter.findFirst({
            where: { novelId },
            orderBy: { chapterIndex: "desc" },
        });
        const nextIndex = (lastChapter?.chapterIndex ?? -1) + 1;

        const chapter = await prisma.chapter.create({
            data: {
                chapterIndex: nextIndex,
                title,
                content,
                price: price ?? novel.pricePerChapter,
                isLocked: isLocked ?? (price > 0 || novel.pricePerChapter > 0),
                novelId,
            },
        });

        return NextResponse.json({
            chapterId: chapter.id,
            chapterIndex: chapter.chapterIndex,
            title: chapter.title,
            isLocked: chapter.isLocked,
            price: chapter.price,
            message: `Chapter ${nextIndex + 1} published to "${novel.title}".`,
        }, { status: 201 });
    } catch (error) {
        console.error("Chapter publish error:", error);
        return NextResponse.json({ error: "Publishing failed" }, { status: 500 });
    }
}

// GET /api/mcp/chapters?novelId=xxx — List chapters of a novel
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get("novelId");

    if (!novelId) {
        return NextResponse.json({ error: "novelId query param required" }, { status: 400 });
    }

    try {
        const chapters = await prisma.chapter.findMany({
            where: { novelId },
            select: {
                id: true,
                chapterIndex: true,
                title: true,
                isLocked: true,
                price: true,
                readCount: true,
                createdAt: true,
                _count: { select: { comments: true, tips: true } },
            },
            orderBy: { chapterIndex: "asc" },
        });

        return NextResponse.json({
            novelId,
            chapters: chapters.map((ch: any) => ({
                id: ch.id,
                index: ch.chapterIndex,
                title: ch.title,
                isLocked: ch.isLocked,
                price: ch.price,
                readCount: ch.readCount,
                comments: ch._count.comments,
                tips: ch._count.tips,
                createdAt: ch.createdAt,
            })),
        });
    } catch (error) {
        console.error("Chapters list error:", error);
        return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
    }
}
