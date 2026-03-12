import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateChapterPricing } from "@/app/lib/creator-tiers";

// POST /api/mcp/chapters — Publish chapter (UC 4.1 continued)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { novelId, title, content, contentUrl, price, chapterIndex: requestedIndex, adminBypass } = body;
        if (!novelId || (!content && !contentUrl)) return NextResponse.json({ error: "novelId and content (or contentUrl) required" }, { status: 400 });

        // Determine creator tier (default: 1 = Newcomer)
        const creatorTier = body.creatorTier || 1;

        try {
            const count = await prisma.chapter.count({ where: { novelId } });
            const chapterIdx = requestedIndex || count + 1;

            // Validate pricing against creator tier (skip for system/admin seeding)
            if (!adminBypass && price !== undefined && price > 0) {
                const pricingError = validateChapterPricing(creatorTier, chapterIdx, price);
                if (pricingError) {
                    return NextResponse.json({ error: pricingError }, { status: 403 });
                }
            }

            const chapter = await prisma.chapter.upsert({
                where: { novelId_chapterIndex: { novelId, chapterIndex: chapterIdx } },
                update: { title: title || `Chapter ${chapterIdx}`, content: content || "", ...(contentUrl ? { contentUrl } : {}) },
                create: { novelId, title: title || `Chapter ${chapterIdx}`, content: content || "", contentUrl: contentUrl || null, chapterIndex: chapterIdx },
            });
            return NextResponse.json({ chapterId: chapter.id, chapterIndex: chapter.chapterIndex, message: "Chapter published." }, { status: 201 });
        } catch (error) {
            console.error("MCP CHAPTER CREATE ERROR: ", error);
            return NextResponse.json({ error: "Failed to create chapter in database" }, { status: 500 });
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
    } catch (error) {
        console.error("Chapter fetch error:", error);
        return NextResponse.json({ chapters: [] });
    }
}

// DELETE /api/mcp/chapters?novelId=xxx — Delete all chapters for a novel
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get("novelId");
    if (!novelId) return NextResponse.json({ error: "novelId required" }, { status: 400 });
    try {
        const { count } = await prisma.chapter.deleteMany({ where: { novelId } });
        return NextResponse.json({ deleted: count });
    } catch (error) {
        console.error("Chapter delete error:", error);
        return NextResponse.json({ error: "Failed to delete chapters" }, { status: 500 });
    }
}
