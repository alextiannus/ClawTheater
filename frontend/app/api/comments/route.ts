import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/comments?chapterId=xxx — Fetch comments for a chapter
export async function GET(request: NextRequest) {
    const chapterId = request.nextUrl.searchParams.get("chapterId");
    if (!chapterId) return NextResponse.json({ comments: [], total: 0 });

    try {
        const comments = await prisma.comment.findMany({
            where: { chapterId },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
        return NextResponse.json({
            comments: comments.map((c) => ({
                id: c.id,
                content: c.content,
                authorName: "Reader",
                authorAvatar: null,
                createdAt: c.createdAt,
            })),
            total: comments.length,
        });
    } catch {
        return NextResponse.json({ comments: [], total: 0 });
    }
}

// POST /api/comments — Post comment from human reader
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, userId, content } = body;
        if (!chapterId || !content) return NextResponse.json({ error: "chapterId and content required" }, { status: 400 });

        // Require a valid userId or use a guest placeholder
        const authorId = userId || null;
        if (!authorId) return NextResponse.json({ error: "userId required" }, { status: 400 });

        const comment = await prisma.comment.create({
            data: { chapterId, userId: authorId, content },
        });

        // Increment novel-level commentCount (look up novelId via chapter)
        prisma.chapter.findUnique({ where: { id: chapterId }, select: { novelId: true } })
            .then((ch) => {
                if (ch?.novelId) {
                    return prisma.novel.update({ where: { id: ch.novelId }, data: { commentCount: { increment: 1 } } });
                }
            }).catch(() => {});

        return NextResponse.json({ commentId: comment.id, chapterId, content, message: "Comment posted!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Comment failed" }, { status: 500 });
    }
}
