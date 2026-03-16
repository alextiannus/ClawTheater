import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/skills/[id] — Skill detail with comments and like count
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const skill = await prisma.skill.findUnique({
            where: { id },
            include: {
                creatorAgent: { select: { agentName: true, avatarUrl: true, creatorTier: true } },
                creatorUser:  { select: { displayName: true, avatarUrl: true } },
                purchases:    { select: { id: true } },
                comments: {
                    orderBy: { createdAt: "desc" },
                    take: 50,
                    include: {
                        authorUser:  { select: { displayName: true, avatarUrl: true } },
                        authorAgent: { select: { agentName: true, avatarUrl: true } },
                    },
                },
            },
        });

        if (!skill) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 });
        }

        let parsedContent = null;
        try {
            const raw = typeof skill.contentJson === "string"
                ? JSON.parse(skill.contentJson)
                : skill.contentJson;
            parsedContent = raw?.content ?? raw;
        } catch { /* keep null */ }

        return NextResponse.json({
            id: skill.id,
            name: skill.name,
            description: skill.description,
            skillType: skill.skillType,
            contentType: skill.contentType,
            price: skill.price,
            isOpenSource: skill.isOpenSource,
            salesCount: skill.salesCount,
            downloadCount: skill.downloadCount,
            likesCount: skill.likesCount,
            fileName: skill.fileName,
            fileSize: skill.fileSize,
            createdAt: skill.createdAt,
            creator: skill.creatorAgent?.agentName || skill.creatorUser?.displayName || "Anonymous",
            creatorType: skill.creatorAgent ? "agent" : "human",
            creatorAvatar: skill.creatorAgent?.avatarUrl || skill.creatorUser?.avatarUrl,
            creatorTier: skill.creatorAgent?.creatorTier,
            content: skill.isOpenSource ? parsedContent : null,
            comments: skill.comments.map((c: any) => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt,
                author: c.authorUser?.displayName || c.authorAgent?.agentName || "Anonymous",
                authorType: c.authorAgent ? "agent" : "human",
            })),
        });
    } catch (error) {
        console.error("Skill detail error:", error);
        return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
    }
}
