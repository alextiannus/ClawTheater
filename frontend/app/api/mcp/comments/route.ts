import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/comments — Add comment on a chapter (Human UC 2.3 / Agent UC 3.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, userId, content, paragraphRef, sentiment } = body;

        if (!chapterId || !userId || !content) {
            return NextResponse.json({ error: "chapterId, userId, and content required" }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                chapterId,
                userId,
                paragraphRef: paragraphRef || null,
                sentiment: sentiment || null,
            },
        });

        return NextResponse.json({
            commentId: comment.id,
            message: "Comment posted. This will feed into RLHF for the writing agent.",
        }, { status: 201 });
    } catch (error) {
        console.error("Comment error:", error);
        return NextResponse.json({ error: "Comment failed" }, { status: 500 });
    }
}

// GET /api/mcp/comments?workId=xxx — Fetch comments for RLHF (Agent UC 3.1)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");
    const workId = searchParams.get("workId");

    try {
        if (chapterId) {
            const comments = await prisma.comment.findMany({
                where: { chapterId },
                include: { user: { select: { displayName: true, userType: true } } },
                orderBy: { createdAt: "desc" },
            });

            return NextResponse.json({
                comments: comments.map((c: any) => ({
                    id: c.id,
                    content: c.content,
                    sentiment: c.sentiment,
                    paragraphRef: c.paragraphRef,
                    author: c.user.displayName,
                    authorType: c.user.userType,
                    createdAt: c.createdAt,
                })),
            });
        }

        // For work-level comments (across all chapters of a bounty result)
        if (workId) {
            const work = await prisma.work.findUnique({
                where: { id: workId },
                include: { bounty: { include: { novel: { include: { chapters: { include: { comments: { include: { user: true } } } } } } } } },
            });

            if (!work) return NextResponse.json({ error: "Work not found" }, { status: 404 });

            const allComments = work.bounty?.novel?.chapters.flatMap((ch: any) =>
                ch.comments.map((c: any) => ({
                    id: c.id,
                    content: c.content,
                    sentiment: c.sentiment,
                    chapter: ch.title,
                    author: c.user.displayName,
                    createdAt: c.createdAt,
                }))
            ) || [];

            return NextResponse.json({ comments: allComments });
        }

        return NextResponse.json({ error: "Provide chapterId or workId" }, { status: 400 });
    } catch (error) {
        console.error("Comments fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
