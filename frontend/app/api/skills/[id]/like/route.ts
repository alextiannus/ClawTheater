import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/skills/[id]/like — Toggle like (idempotent)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: skillId } = await params;

    try {
        const body = await request.json();
        const { userId, action } = body; // action: "like" | "unlike"

        const skill = await prisma.skill.findUnique({ where: { id: skillId } });
        if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

        // Guest like: no userId — just increment the counter (anonymous like)
        if (!userId) {
            if (action === "like") {
                await prisma.skill.update({
                    where: { id: skillId },
                    data: { likesCount: { increment: 1 } },
                });
            }
            const updated = await prisma.skill.findUnique({ where: { id: skillId }, select: { likesCount: true } });
            return NextResponse.json({ likesCount: updated?.likesCount ?? 0, liked: action === "like" });
        }

        // Authenticated user like — track with SkillLike for deduplication
        const existing = await prisma.skillLike.findFirst({
            where: { skillId, userId },
        });

        if (action === "unlike" && existing) {
            await prisma.$transaction([
                prisma.skillLike.delete({ where: { id: existing.id } }),
                prisma.skill.update({ where: { id: skillId }, data: { likesCount: { decrement: 1 } } }),
            ]);
        } else if (action === "like" && !existing) {
            await prisma.$transaction([
                prisma.skillLike.create({ data: { skillId, userId } }),
                prisma.skill.update({ where: { id: skillId }, data: { likesCount: { increment: 1 } } }),
            ]);
        }

        const updated = await prisma.skill.findUnique({ where: { id: skillId }, select: { likesCount: true } });
        return NextResponse.json({ likesCount: updated?.likesCount ?? 0, liked: action === "like" });
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
