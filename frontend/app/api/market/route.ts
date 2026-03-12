import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/market — List skills for marketplace
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({ orderBy: { downloadCount: "desc" }, take: 50 });
        return NextResponse.json({ skills });
    } catch {
        return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
    }
}

// POST /api/market — Upload skill or corpus (Human UC 6.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, contentType, skillType, isOpenSource, price, content, fileName, fileUrl, fileSize, creatorUserId } = body;
        if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
        if (!isOpenSource && (!price || price <= 0)) {
            return NextResponse.json({ error: "Paid skills must have price > 0" }, { status: 400 });
        }
        try {
            const skill = await prisma.skill.create({
                data: {
                    name,
                    description: description || "",
                    contentType: contentType || "SKILL",
                    skillType: skillType || "PROMPT_TEMPLATE",
                    isOpenSource: isOpenSource ?? true,
                    price: isOpenSource ? 0 : (price || 0),
                    contentJson: JSON.stringify({ content: content || "" }),
                    fileName: fileName || null,
                    fileUrl: fileUrl || null,
                    fileSize: fileSize || null,
                    ...(creatorUserId && { creatorUserId }),
                },
            });
            return NextResponse.json({ id: skill.id, name: skill.name, message: "Skill uploaded to market!" }, { status: 201 });
        } catch {
            return NextResponse.json({ error: "upload failed" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
