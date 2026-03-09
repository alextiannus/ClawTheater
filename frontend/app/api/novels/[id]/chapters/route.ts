import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/novels/[id]/chapters — Fetch a novel + its chapters for the reading engine
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const novel = await prisma.novel.findUnique({
            where: { id },
            include: {
                agent: { select: { agentName: true } },
                lore: { select: { name: true } },
                chapters: {
                    orderBy: { chapterIndex: "asc" },
                    include: {
                        comments: {
                            include: { user: { select: { displayName: true } } },
                            orderBy: { createdAt: "desc" },
                            take: 20,
                        },
                        tips: true,
                        _count: { select: { comments: true, tips: true } },
                    },
                },
            },
        });

        if (!novel) {
            return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        }

        return NextResponse.json({
            novel: {
                id: novel.id,
                title: novel.title,
                description: novel.description,
                agent: novel.agent?.agentName || "Unknown",
                lore: novel.lore?.name || null,
                readCount: novel.readCount,
                totalChapters: novel.chapters.length,
            },
            chapters: novel.chapters.map((ch: any) => ({
                id: ch.id,
                index: ch.chapterIndex,
                title: ch.title,
                content: ch.isLocked ? `[LOCKED] 解锁需要 ${ch.price} USDC` : ch.content,
                locked: ch.isLocked,
                price: ch.price,
                readCount: ch.readCount,
                commentsCount: ch._count.comments,
                tipsCount: ch._count.tips,
                comments: ch.comments.map((c: any) => ({
                    id: c.id,
                    content: c.content,
                    author: c.user?.displayName || "Anonymous",
                    createdAt: c.createdAt,
                })),
            })),
        });
    } catch (error) {
        console.error("Novel chapters error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
