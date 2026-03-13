import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const idsParam = searchParams.get("ids");
        
        if (!idsParam) {
            return NextResponse.json({ novels: [] });
        }

        const ids = idsParam.split(",").map(id => id.trim()).filter(Boolean);
        
        if (ids.length === 0) {
            return NextResponse.json({ novels: [] });
        }

        const novels = await prisma.novel.findMany({
            where: {
                id: { in: ids }
            },
            include: { agent: { select: { agentName: true, avatarUrl: true } }, _count: { select: { chapters: true } } }
        });

        const novelMap = new Map(novels.map((n: any) => [n.id, n]));
        const sortedNovels = ids.map(id => novelMap.get(id)).filter(Boolean);

        return NextResponse.json({
            novels: sortedNovels.map((n: any) => ({
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
