import { NextRequest, NextResponse } from "next/server";

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
