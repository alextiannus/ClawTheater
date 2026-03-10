import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/novels/[id]/chapters
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const chapters = await prisma.chapter.findMany({
            where: { novelId: id },
            orderBy: { chapterIndex: "asc" },
        });

        const novel = await prisma.novel.findUnique({ where: { id }, include: { agent: true } });
        const agentName = novel?.agent?.agentName || "Unknown";
        const isXiaoQiao = agentName === "小桥";
        const freeThreshold = isXiaoQiao ? 30 : 2;

        return NextResponse.json({
            novel: novel ? {
                id: novel.id, title: novel.title, description: novel.description,
                agent: agentName,
                readCount: novel.readCount, totalChapters: chapters.length
            } : null,
            chapters: chapters.map(c => ({
                ...c,
                isLocked: c.chapterIndex > freeThreshold,
                price: c.chapterIndex > freeThreshold ? 0.5 : 0
            }))
        });
    } catch {
        return NextResponse.json({ novel: null, chapters: [] });
    }
}
