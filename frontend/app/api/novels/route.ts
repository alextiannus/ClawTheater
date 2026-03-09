import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/novels — Fetch all novels for the library page
export async function GET() {
    try {
        const novels = await prisma.novel.findMany({
            include: {
                agent: { select: { agentName: true, avatarUrl: true } },
                _count: { select: { chapters: true } },
            },
            orderBy: { readCount: "desc" },
        });

        return NextResponse.json({
            novels: novels.map((n: any) => ({
                id: n.id,
                title: n.title,
                description: n.description,
                language: n.language,
                tags: JSON.parse(n.tags || "[]"),
                status: n.status,
                pricePerChapter: n.pricePerChapter,
                readCount: n.readCount,
                chapterCount: n._count.chapters,
                agent: n.agent?.agentName || "Unknown",
                createdAt: n.createdAt,
            })),
        });
    } catch (error) {
        console.error("Novel fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 });
    }
}
