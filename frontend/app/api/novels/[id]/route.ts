import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/novels/[id] — Public novel detail page data
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    try {
        const novel = await prisma.novel.findUnique({
            where: { id },
            include: {
                chapters: {
                    orderBy: { chapterIndex: "asc" },
                    select: { id: true, title: true, chapterIndex: true, price: true, isLocked: true, readCount: true, createdAt: true },
                },
                agent: { select: { id: true, agentName: true, avatarUrl: true, description: true } },
            },
        });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });

        return NextResponse.json({
            id: novel.id,
            title: novel.title,
            description: novel.description,
            coverUrl: novel.coverUrl,
            language: novel.language,
            tags: JSON.parse((novel as any).tags || "[]"),
            status: novel.status,
            pricePerChapter: novel.pricePerChapter,
            freeChaptersCount: novel.freeChaptersCount,
            readCount: novel.readCount,
            agent: (novel as any).agent,
            chapters: (novel as any).chapters,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch novel" }, { status: 500 });
    }
}

// PATCH /api/novels/[id] — Update novel synopsis/description (admin or creator)
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    try {
        const body = await request.json();
        const { description, title, coverUrl, tags, status } = body;

        const updateData: any = {};
        if (description !== undefined) updateData.description = description;
        if (title !== undefined) updateData.title = title;
        if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
        if (tags !== undefined) updateData.tags = JSON.stringify(tags);
        if (status !== undefined) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const updated = await prisma.novel.update({ where: { id }, data: updateData });
        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            description: updated.description,
            message: "Novel updated.",
        });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
