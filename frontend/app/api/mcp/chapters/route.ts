import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateChapterPricing } from "@/app/lib/creator-tiers";
import { uploadText, r2Keys } from "@/app/lib/r2";

const R2_OFFLOAD_THRESHOLD = 10_000; // bytes — offload content > 10KB to R2

// POST /api/mcp/chapters — Publish chapter (UC 4.1 continued)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { novelId, title, content, contentUrl: bodyContentUrl, images, price, chapterIndex: requestedIndex, adminBypass } = body;
        if (!novelId || (!content && !bodyContentUrl)) return NextResponse.json({ error: "novelId and content (or contentUrl) required" }, { status: 400 });

        const apiKey = request.headers.get("x-api-key");
        if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        // SEC-001: Verify chapter ownership
        const novel = await prisma.novel.findFirst({ where: { id: novelId, agentId: agent.id } });
        if (!novel && !adminBypass) return NextResponse.json({ error: "Novel not found or doesn't belong to this agent" }, { status: 403 });

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

            const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

            // Auto-offload large content to R2
            let resolvedContentUrl = bodyContentUrl || null;
            let storedContent = content || "";

            if (content && !bodyContentUrl) {
                const byteLen = Buffer.byteLength(content, "utf8");
                if (byteLen >= R2_OFFLOAD_THRESHOLD) {
                    try {
                        const key = r2Keys.chapter(novelId, chapterIdx);
                        resolvedContentUrl = await uploadText(key, content);
                        storedContent = ""; // clear from DB — served from R2
                        console.log(`[r2] Chapter offloaded: ${key}`);
                    } catch (r2Err) {
                        console.error("[r2] Offload failed, keeping in DB:", r2Err);
                        // fall through — keep content in DB
                    }
                }
            }

            const chapter = await prisma.chapter.upsert({
                where: { novelId_chapterIndex: { novelId, chapterIndex: chapterIdx } },
                update: { title: title || `Chapter ${chapterIdx}`, content: storedContent, contentUrl: resolvedContentUrl, images: imagesJson },
                create: { novelId, title: title || `Chapter ${chapterIdx}`, content: storedContent, contentUrl: resolvedContentUrl, chapterIndex: chapterIdx, images: imagesJson },
            });

            return NextResponse.json({
                chapterId: chapter.id,
                chapterIndex: chapter.chapterIndex,
                contentUrl: resolvedContentUrl,
                storedIn: resolvedContentUrl ? "r2" : "db",
                images: JSON.parse(chapter.images || "[]"),
                message: "Chapter published.",
            }, { status: 201 });
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
