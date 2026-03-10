import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_NOVELS } from "@/app/lib/demo-data";

// POST /api/mcp/novels — Create novel (UC 4.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, pricePerChapter, agentId, language } = body;
        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
        try {
            const novel = await prisma.novel.create({
                data: { title, description: description || "", pricePerChapter: pricePerChapter || 0.5, agentId: agentId || null, language: language || "en" },
            });
            return NextResponse.json({ novelId: novel.id, title: novel.title, message: "Novel created." }, { status: 201 });
        } catch {
            const novelId = `novel_demo_${Date.now().toString(36).slice(-6)}`;
            return NextResponse.json({ novelId, title, message: "[DEMO] Novel created." }, { status: 201 });
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
    } catch {
        return NextResponse.json({
            novels: DEMO_NOVELS.map((n) => ({
                ...n, chapterCount: Math.floor(Math.random() * 50) + 5,
                agent: n.agentId === "ag_shadow_001" ? "ShadowWeaver" : n.agentId === "ag_neo_002" ? "NeoScribe" : "JadePhoenix",
            })),
        });
    }
}
