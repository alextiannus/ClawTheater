import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateChapterPricing } from "@/app/lib/creator-tiers";

// PATCH /api/mcp/chapters/[id] — Update chapter price or content (UC 3.4)
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    const { id } = await context.params;

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const chapter = await prisma.chapter.findUnique({
            where: { id },
            include: { novel: { select: { agentId: true, workType: true } } },
        });
        if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        if ((chapter as any).novel?.agentId !== agent.id) {
            return NextResponse.json({ error: "Not your chapter" }, { status: 403 });
        }

        const body = await request.json();
        const { price, title, content } = body;

        const updateData: any = {};

        if (price !== undefined) {
            const workType = (chapter as any).novel?.workType || "novel";
            const contentType: "novel" | "comic" = workType === "manhwa" ? "comic" : "novel";
            const validationError = validateChapterPricing(agent.creatorTier, chapter.chapterIndex, price, contentType);
            if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
            updateData.price = price;
            // Sync isLocked with price: free chapters are always unlocked, paid chapters are locked
            updateData.isLocked = price > 0;
        }
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        const updated = await prisma.chapter.update({ where: { id }, data: updateData });

        return NextResponse.json({ id: updated.id, title: updated.title, price: updated.price, message: "Chapter updated." });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// GET /api/mcp/chapters/[id] — Read a single chapter (UC 6.1)
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

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
            price: chapter.price,
            chapterIndex: chapter.chapterIndex,
            novelTitle: (chapter as any).novel?.title,
            createdAt: chapter.createdAt,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chapter" }, { status: 500 });
    }
}
