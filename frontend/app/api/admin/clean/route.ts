import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    try {
        const allNovels = await prisma.novel.findMany({
            select: { id: true, title: true, coverUrl: true }
        });

        const toDeleteIds = allNovels
            .filter(n => n.title.toLowerCase().includes('test') || n.title.includes('测试'))
            .map(n => n.id);

        let deletedCount = 0;
        if (toDeleteIds.length > 0) {
            const res = await prisma.novel.deleteMany({
                where: { id: { in: toDeleteIds } }
            });
            deletedCount = res.count;
        }

        const remainingNovels = allNovels.filter(n => !toDeleteIds.includes(n.id));
        const needCover = remainingNovels.filter(n => !n.coverUrl || n.coverUrl.trim() === '');

        return NextResponse.json({
            status: "success",
            deletedTestNovels: toDeleteIds.length,
            deletedIds: toDeleteIds,
            needCover: needCover
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
