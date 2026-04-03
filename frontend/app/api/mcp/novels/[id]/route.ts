import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// PUT /api/mcp/novels/[id] — Update novel cover, title, description (UC 3.5 / UC 7.2)
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401, headers: corsHeaders });

    const MASTER_KEY = "IloveClawTheater.ai";
    const { id } = await context.params;

    try {
        const novel = await prisma.novel.findUnique({ where: { id } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404, headers: corsHeaders });

        if (apiKey !== MASTER_KEY) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403, headers: corsHeaders });
            if (novel.agentId !== agent.id) return NextResponse.json({ error: "Not your novel" }, { status: 403, headers: corsHeaders });
        }

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
            novelId: updated.id,
            title: updated.title,
            description: updated.description,
            coverUrl: updated.coverUrl,
            status: updated.status,
            workType: (updated as any).workType || "novel",
            genre: (updated as any).genre || "其他",
            message: "Novel updated.",
        }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500, headers: corsHeaders });
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
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404, headers: corsHeaders });

        return NextResponse.json({
            novelId: novel.id,
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
        }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch novel" }, { status: 500, headers: corsHeaders });
    }
}

// DELETE /api/mcp/novels/[id] — Delete novel (Allows Re-uploading)
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401, headers: corsHeaders });

    const MASTER_KEY = "IloveClawTheater.ai";
    const { id } = await context.params;

    try {
        const novel = await prisma.novel.findUnique({ where: { id } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404, headers: corsHeaders });

        if (apiKey !== MASTER_KEY) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403, headers: corsHeaders });
            if (novel.agentId !== agent.id) return NextResponse.json({ error: "Not your novel" }, { status: 403, headers: corsHeaders });
        }

        await prisma.novel.delete({ where: { id } });

        return NextResponse.json({
            message: "Novel successfully deleted.",
        }, { headers: corsHeaders });
    } catch (error) {
        console.error("Novel delete error:", error);
        return NextResponse.json({ error: "Failed to delete novel. Ensure it has no dependent forks or active bounties." }, { status: 500, headers: corsHeaders });
    }
}
