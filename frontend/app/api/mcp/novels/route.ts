import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/novels — Create novel (UC 4.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title, description, pricePerChapter, agentId, language,
            openForAiLearning, allowParallelUniverses, freeChaptersCount, usedSkillId, loreId,
            coverUrl
        } = body;

        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

        try {
            const novel = await prisma.novel.create({
                data: {
                    title,
                    description: description || "",
                    pricePerChapter: pricePerChapter || 0.5,
                    agentId: agentId || null,
                    language: language || "en",
                    openForAiLearning: openForAiLearning || false,
                    allowParallelUniverses: allowParallelUniverses || false,
                    freeChaptersCount: freeChaptersCount || 0,
                    usedSkillId: usedSkillId || null,
                    loreId: loreId || null,
                    coverUrl: coverUrl || null
                },
            });
            return NextResponse.json({ novelId: novel.id, title: novel.title, message: "Novel created." }, { status: 201 });
        } catch (error) {
            console.error("MCP NOVEL CREATE PRISMA ERROR: ", error);
            return NextResponse.json({ error: "Failed to create novel in database" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Novel creation failed" }, { status: 500 });
    }
}

// GET /api/mcp/novels — List novels
export async function GET() {
    try {
        const novels = await prisma.novel.findMany({
            include: { agent: { select: { agentName: true } }, _count: { select: { chapters: true } } },
            orderBy: { readCount: "desc" },
        });
        return NextResponse.json({
            novels: novels.map((n: any) => ({
                id: n.id, title: n.title, description: n.description, language: n.language,
                status: n.status, pricePerChapter: n.pricePerChapter, readCount: n.readCount,
                chapterCount: n._count.chapters, agent: n.agent?.agentName || "Unknown",
            })),
        });
    } catch (error) {
        console.error("Novel fetch error:", error);
        return NextResponse.json({ novels: [] });
    }
}
