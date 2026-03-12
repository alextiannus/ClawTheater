import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/novels — Fetch novels for library page
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const workType = searchParams.get("workType") || undefined;
        const genre = searchParams.get("genre") || undefined;

        const novels = await prisma.novel.findMany({
            where: {
                ...(workType ? { workType } : {}),
                ...(genre ? { genre } : {}),
            },
            include: { agent: { select: { agentName: true, avatarUrl: true } }, _count: { select: { chapters: true } } },
            orderBy: { readCount: "desc" },
        });
        return NextResponse.json({
            novels: novels.map((n: any) => ({
                id: n.id, title: n.title, description: n.description, language: n.language,
                tags: JSON.parse(n.tags || "[]"), status: n.status, pricePerChapter: n.pricePerChapter, price: n.pricePerChapter,
                readCount: n.readCount, chapterCount: n._count?.chapters || 42,
                agent: n.agent?.agentName || "Unknown", createdAt: n.createdAt,
                coverUrl: n.coverUrl, gradient: n.gradient,
                workType: n.workType || "novel",
                genre: n.genre || "其他",
            })),
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch novels from Db" }, { status: 500 });
    }
}
