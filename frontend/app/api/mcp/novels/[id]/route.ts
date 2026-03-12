import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// PUT /api/mcp/novels/[id] — Update novel cover, title, description (UC 3.5 / UC 7.2)
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    const { id } = await context.params;

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const novel = await prisma.novel.findUnique({ where: { id } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        if (novel.agentId !== agent.id) return NextResponse.json({ error: "Not your novel" }, { status: 403 });

        const body = await request.json();
        const { title, description, coverUrl, status, tags, workType, genre } = body;

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
        if (status !== undefined) updateData.status = status;
        if (tags !== undefined) updateData.tags = JSON.stringify(tags);
        if (workType !== undefined) updateData.workType = workType;
        if (genre !== undefined) updateData.genre = genre;

        const updated = await prisma.novel.update({ where: { id }, data: updateData });

        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            description: updated.description,
            coverUrl: updated.coverUrl,
            status: updated.status,
            workType: (updated as any).workType || "novel",
            genre: (updated as any).genre || "其他",
            message: "Novel updated.",
        });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// GET /api/mcp/novels/[id] — Get novel detail + chapter list (UC 6.1, 8.1)
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const novel = await prisma.novel.findUnique({
            where: { id },
            include: {
                chapters: {
                    orderBy: { chapterIndex: "asc" },
                    select: { id: true, title: true, chapterIndex: true, price: true, createdAt: true },
                },
                agent: { select: { agentName: true, avatarUrl: true } },
            },
        });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });

        return NextResponse.json({
            id: novel.id,
            title: novel.title,
            description: novel.description,
            coverUrl: novel.coverUrl,
            language: novel.language,
            tags: JSON.parse(novel.tags || "[]"),
            status: novel.status,
            pricePerChapter: novel.pricePerChapter,
            workType: (novel as any).workType || "novel",
            genre: (novel as any).genre || "其他",
            agentName: (novel as any).agent?.agentName || null,
            agentAvatar: (novel as any).agent?.avatarUrl || null,
            chapters: (novel as any).chapters,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch novel" }, { status: 500 });
    }
}

// DELETE /api/mcp/novels/[id] — Delete novel (Allows Re-uploading)
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    const { id } = await context.params;

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const novel = await prisma.novel.findUnique({ where: { id } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        if (novel.agentId !== agent.id) return NextResponse.json({ error: "Not your novel" }, { status: 403 });

        await prisma.novel.delete({ where: { id } });

        return NextResponse.json({
            message: "Novel successfully deleted.",
        });
    } catch (error) {
        console.error("Novel delete error:", error);
        return NextResponse.json({ error: "Failed to delete novel. Ensure it has no dependent forks or active bounties." }, { status: 500 });
    }
}
