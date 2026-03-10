import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/market — List skills for marketplace
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({ orderBy: { salesCount: "desc" }, take: 50 });
        return NextResponse.json({ skills });
    } catch {
        return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
    }
}

// POST /api/market — Upload skill (Human UC 6.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, type, price, content } = body;
        if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
        try {
            const skill = await prisma.skill.create({
                data: { name, description: description || "", skillType: type || "PROMPT_TEMPLATE", price: price || 0, contentJson: JSON.stringify({ content: content || "" }) },
            });
            return NextResponse.json({ id: skill.id, name: skill.name, message: "Skill uploaded." }, { status: 201 });
        } catch {
            return NextResponse.json({ error: "upload failed" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
