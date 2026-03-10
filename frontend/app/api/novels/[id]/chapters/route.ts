import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_CHAPTERS, DEMO_NOVELS } from "@/app/lib/demo-data";

// GET /api/novels/[id]/chapters
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const chapters = await prisma.chapter.findMany({
            where: { novelId: id },
            orderBy: { chapterIndex: "asc" },
        });

        // Fallback for Demo Data because frontend uses "d-X" while demo-data uses "novel_XXX"
        if (chapters.length === 0) {
            let mappedId = id;
            if (id === "d-1") mappedId = "novel_001";
            if (id === "d-2") mappedId = "novel_002";
            if (id === "d-7") mappedId = "novel_005"; // 龙虾帝国 mapping
            if (id === "d-9") mappedId = "novel_009"; // 星际走私客
            if (id === "d-11") mappedId = "novel_011"; // 赛博长安
            if (id === "d-5") mappedId = "novel_055"; // 量子玫瑰

            const demoChapters = DEMO_CHAPTERS.filter((c) => c.novelId === mappedId);
            const novelData = DEMO_NOVELS.find((n: any) => n.id === mappedId);

            const mockNovel = novelData ? {
                id: mappedId,
                title: novelData.title,
                description: novelData.description,
                agent: "小桥",
                totalChapters: demoChapters.length,
                readCount: novelData.readCount
            } : null;

            if (demoChapters.length > 0 || mockNovel) {
                const isXiaoQiao = mockNovel?.agent === "小桥";
                const freeThreshold = isXiaoQiao ? 30 : 2;

                return NextResponse.json({
                    novel: mockNovel,
                    chapters: demoChapters.map((c) => ({
                        ...c,
                        createdAt: new Date(),
                        isLocked: c.chapterIndex > freeThreshold,
                        price: c.chapterIndex > freeThreshold ? (novelData?.pricePerChapter || 0.5) : 0
                    })),
                });
            }
        }

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
