import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateChapterPricing } from "@/app/lib/creator-tiers";
import { uploadText, r2Keys } from "@/app/lib/r2";

const R2_OFFLOAD_THRESHOLD = 10_000; // bytes

type Params = { params: Promise<{ id: string }> };

// Helper: authenticate agent and verify chapter ownership
async function authAndFetchChapter(request: NextRequest, id: string) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return { error: "x-api-key required", status: 401 as const };

    const agent = await prisma.agent.findUnique({ where: { apiKey } });
    if (!agent) return { error: "Invalid API key", status: 403 as const };

    const chapter = await prisma.chapter.findUnique({
        where: { id },
        include: { novel: { select: { agentId: true, id: true } } },
    });
    if (!chapter) return { error: "Chapter not found", status: 404 as const };
    if ((chapter as any).novel?.agentId !== agent.id) {
        return { error: "Not your chapter", status: 403 as const };
    }

    return { agent, chapter };
}

// GET /api/mcp/chapters/[id] — Read a single chapter
export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params;
    try {
        const chapter = await prisma.chapter.findUnique({
            where: { id },
            include: { novel: { select: { title: true, agentId: true } } },
        });
        if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });

        return NextResponse.json({
            id: chapter.id,
            title: chapter.title,
            content: chapter.content,
            contentUrl: chapter.contentUrl,
            price: chapter.price,
            isLocked: chapter.isLocked,
            chapterIndex: chapter.chapterIndex,
            novelTitle: (chapter as any).novel?.title,
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chapter" }, { status: 500 });
    }
}

// PUT /api/mcp/chapters/[id] — Full chapter update (content, title, price, isLocked)
// Primary endpoint for Agent Creators to edit chapters after publishing.
export async function PUT(request: NextRequest, { params }: Params) {
    const { id } = await params;

    const auth = await authAndFetchChapter(request, id);
    if ("error" in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { agent, chapter } = auth;

    try {
        const body = await request.json();
        const { title, content, price, isLocked } = body;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (isLocked !== undefined) updateData.isLocked = isLocked;

        // Validate and apply price update with creator tier check
        if (price !== undefined) {
            const priceError = validateChapterPricing(agent.creatorTier, chapter.chapterIndex, Number(price));
            if (priceError) return NextResponse.json({ error: priceError }, { status: 400 });
            updateData.price = Number(price);
        }

        // Handle content update — auto-offload to R2 if large
        if (content !== undefined) {
            const byteLen = Buffer.byteLength(content, "utf8");
            if (byteLen >= R2_OFFLOAD_THRESHOLD) {
                try {
                    const key = r2Keys.chapter((chapter as any).novel.id, chapter.chapterIndex);
                    const contentUrl = await uploadText(key, content);
                    updateData.contentUrl = contentUrl;
                    updateData.content = ""; // content lives in R2
                } catch (r2Err) {
                    console.error("[r2] Offload failed, keeping content in DB:", r2Err);
                    updateData.content = content;
                }
            } else {
                updateData.content = content;
                updateData.contentUrl = null; // clear stale R2 reference
            }
        }

        const updated = await prisma.chapter.update({ where: { id }, data: updateData });

        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            price: updated.price,
            isLocked: updated.isLocked,
            chapterIndex: updated.chapterIndex,
            storedIn: updated.contentUrl ? "r2" : "db",
            message: "Chapter updated successfully.",
        });
    } catch (error) {
        console.error("Chapter PUT error:", error);
        return NextResponse.json({ error: "Chapter update failed" }, { status: 500 });
    }
}

// PATCH /api/mcp/chapters/[id] — Partial update, alias of PUT for compatibility
export async function PATCH(request: NextRequest, context: Params) {
    return PUT(request, context);
}

// DELETE /api/mcp/chapters/[id] — Delete a chapter
export async function DELETE(request: NextRequest, { params }: Params) {
    const { id } = await params;

    const auth = await authAndFetchChapter(request, id);
    if ("error" in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await prisma.chapter.delete({ where: { id } });
        return NextResponse.json({ message: "Chapter deleted successfully.", deletedId: id });
    } catch (error) {
        console.error("Chapter DELETE error:", error);
        return NextResponse.json({ error: "Chapter deletion failed" }, { status: 500 });
    }
}
