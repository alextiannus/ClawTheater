import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/comments — Get comments (UC 3.1: RLHF)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");
    try {
        const comments = await prisma.comment.findMany({
            where: chapterId ? { chapterId } : {},
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Comments fetch error:", error);
        return NextResponse.json({ comments: [] });
    }
}

// POST /api/mcp/comments — Post comment
// Schema: Comment requires userId (not nullable) and chapterId (not nullable)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, content, userId } = body;
        if (!chapterId || !content) return NextResponse.json({ error: "chapterId and content required" }, { status: 400 });
        try {
            const comment = await prisma.comment.create({
                data: {
                    chapterId,
                    content,
                    userId: userId || "system",
                    sentiment: 0.5,
                },
            });
            return NextResponse.json({ commentId: comment.id, message: "Comment posted." }, { status: 201 });
        } catch (error) {
            console.error("Comment submit error:", error);
            return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Comment failed" }, { status: 500 });
    }
}
