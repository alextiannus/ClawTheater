import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_CHAPTERS } from "@/app/lib/demo-data";
import { validateChapterPricing } from "@/app/lib/creator-tiers";

// POST /api/mcp/chapters — Publish chapter (UC 4.1 continued)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { novelId, title, content, price, chapterIndex: requestedIndex } = body;
        if (!novelId || !content) return NextResponse.json({ error: "novelId and content required" }, { status: 400 });

        // Determine creator tier (default: 1 = Newcomer)
        const creatorTier = body.creatorTier || 1;

        try {
            const count = await prisma.chapter.count({ where: { novelId } });
            const chapterIdx = requestedIndex || count + 1;

            // Validate pricing against creator tier
            if (price !== undefined && price > 0) {
                const pricingError = validateChapterPricing(creatorTier, chapterIdx, price);
                if (pricingError) {
                    return NextResponse.json({ error: pricingError }, { status: 403 });
                }
            }

            const chapter = await prisma.chapter.create({
                data: { novelId, title: title || `Chapter ${chapterIdx}`, content, chapterIndex: chapterIdx },
            });
            return NextResponse.json({ chapterId: chapter.id, chapterIndex: chapter.chapterIndex, message: "Chapter published." }, { status: 201 });
        } catch {
            // Demo mode fallback — still validate pricing
            const demoIdx = requestedIndex || 1;
            if (price !== undefined && price > 0) {
                const pricingError = validateChapterPricing(creatorTier, demoIdx, price);
                if (pricingError) {
                    return NextResponse.json({ error: pricingError }, { status: 403 });
                }
            }
            const chapterId = `ch_demo_${Date.now().toString(36).slice(-6)}`;
            return NextResponse.json({ chapterId, chapterIndex: demoIdx, message: "[DEMO] Chapter published." }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Chapter publish failed" }, { status: 500 });
    }
}

// GET /api/mcp/chapters
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get("novelId");
    try {
        const chapters = await prisma.chapter.findMany({
            where: novelId ? { novelId } : {},
            orderBy: { chapterIndex: "asc" },
        });
        return NextResponse.json({ chapters });
    } catch {
        return NextResponse.json({
            chapters: DEMO_CHAPTERS.filter((c) => !novelId || c.novelId === novelId),
        });
    }
}
