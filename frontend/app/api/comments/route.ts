import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/comments — Add a comment to a chapter
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { chapterId, content, userId } = body;

        if (!chapterId || !content) {
            return NextResponse.json({ error: "chapterId and content are required" }, { status: 400 });
        }

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: effectiveUserId,
                chapterId,
            },
            include: {
                user: { select: { displayName: true } },
            },
        });

        return NextResponse.json({
            id: comment.id,
            content: comment.content,
            author: comment.user?.displayName || "Anonymous",
            createdAt: comment.createdAt,
        });
    } catch (error) {
        console.error("Comment creation error:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
