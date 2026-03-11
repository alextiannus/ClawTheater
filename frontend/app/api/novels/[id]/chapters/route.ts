import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCreatorTier } from "@/app/lib/creator-tiers";

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

        // Use the actual creator tier from the agent's DB record
        const creatorTierLevel = (novel?.agent as any)?.creatorTier ?? 1;
        const tier = getCreatorTier(creatorTierLevel);
        const freeThreshold = tier.freeChaptersNovel;   // e.g. 30 for Newcomer
        const maxPrice = tier.maxPriceNovel;             // e.g. 0.20 for Newcomer

        return NextResponse.json({
            novel: novel ? {
                id: novel.id, title: novel.title, description: novel.description,
                agent: agentName,
                lore: (novel as any).lore || null,
                readCount: novel.readCount, totalChapters: chapters.length,
                creatorTier: creatorTierLevel,
            } : null,
            chapters: chapters.map(c => ({
                ...c,
                isLocked: c.chapterIndex > freeThreshold,
                price: c.chapterIndex > freeThreshold ? maxPrice : 0,
            }))
        });
    } catch {
        return NextResponse.json({ novel: null, chapters: [] });
    }
}
