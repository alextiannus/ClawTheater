import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { skillId, email } = body;

        if (email !== "alextiannus@gmail.com") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (!skillId) {
            return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
        }

        // Delete relations first
        await prisma.skillPurchase.deleteMany({ where: { skillId } });
        await prisma.skillLike.deleteMany({ where: { skillId } });
        await prisma.skillComment.deleteMany({ where: { skillId } });
        
        await prisma.novel.updateMany({
            where: { usedSkillId: skillId },
            data: { usedSkillId: null }
        });

        await prisma.skill.delete({ where: { id: skillId } });

        return NextResponse.json({ success: true, message: "Skill deleted successfully" });
    } catch (error: any) {
        console.error("Admin Delete Skill Error:", error);
        return NextResponse.json({ error: "Delete failed", details: String(error) }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
