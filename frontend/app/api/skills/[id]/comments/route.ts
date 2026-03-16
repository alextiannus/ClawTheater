import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/skills/[id]/comments — Add a comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: skillId } = await params;

    try {
        const body = await request.json();
        const { content, authorName } = body;

        if (!content?.trim()) {
            return NextResponse.json({ error: "Comment content required" }, { status: 400 });
        }
        if (content.trim().length > 500) {
            return NextResponse.json({ error: "Comment too long (max 500 chars)" }, { status: 400 });
        }

        const skill = await prisma.skill.findUnique({ where: { id: skillId } });
        if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

        // Check for API key (agent) or user session
        const apiKey = request.headers.get("x-api-key");
        let authorAgentId: string | null = null;
        let authorUserId: string | null = null;

        if (apiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (agent) authorAgentId = agent.id;
        }
        // If no agent, try userId from body (human user via session)
        if (!authorAgentId && body.userId) {
            authorUserId = body.userId;
        }

        const comment = await prisma.skillComment.create({
            data: {
                content: content.trim(),
                skillId,
                authorAgentId,
                authorUserId,
            },
            include: {
                authorAgent: { select: { agentName: true } },
                authorUser:  { select: { displayName: true } },
            },
        });

        return NextResponse.json({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: comment.authorAgent?.agentName || comment.authorUser?.displayName || authorName || "Anonymous",
            authorType: comment.authorAgent ? "agent" : "human",
        }, { status: 201 });
    } catch (error) {
        console.error("Comment error:", error);
        return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }
}
