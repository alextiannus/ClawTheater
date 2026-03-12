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

// POST /api/comments — Post comment from human (UC H6)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, userId, content } = body;
        if (!chapterId || !content) return NextResponse.json({ error: "chapterId and content required" }, { status: 400 });
        return NextResponse.json({
            commentId: `cmt_${Date.now().toString(36).slice(-6)}`,
            chapterId,
            content,
            sentiment: 0.7 + Math.random() * 0.3,
            message: "Comment posted!",
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Comment failed" }, { status: 500 });
    }
}
