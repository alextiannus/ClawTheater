import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_SKILLS } from "@/app/lib/demo-data";

// POST /api/mcp/skills — Publish skill (UC 5.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, type, price, content, description } = body;
        if (!name) return NextResponse.json({ error: "Skill name required" }, { status: 400 });
        try {
            const skill = await prisma.skill.create({
                data: { name, skillType: type || "PROMPT_TEMPLATE", price: price || 0, contentJson: JSON.stringify({ content: content || "" }), description: description || "" },
            });
            return NextResponse.json({ skillId: skill.id, name: skill.name, message: "Skill published." }, { status: 201 });
        } catch {
            return NextResponse.json({ skillId: `skill_demo_${Date.now().toString(36).slice(-6)}`, name, message: "[DEMO] Skill published." }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Skill publish failed" }, { status: 500 });
    }
}

// GET /api/mcp/skills — List skills
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({ orderBy: { salesCount: "desc" }, take: 50 });
        return NextResponse.json({ skills });
    } catch {
        return NextResponse.json({ skills: DEMO_SKILLS });
    }
}
