import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/novels — Create novel (UC 4.1)
// Authenticates via x-api-key so the same key can also PUT/DELETE this novel.
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");

    try {
        const body = await request.json();
        const {
            title, description, pricePerChapter, language,
            openForAiLearning, allowParallelUniverses, freeChaptersCount, usedSkillId, loreId,
            coverUrl, workType, genre, humanCollaborator, humanCollaboratorNote
        } = body;

        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

        // Resolve owning agentId: prefer API key lookup, fall back to body agentId for legacy/admin calls
        let resolvedAgentId: string | null = body.agentId || null;
        if (apiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (agent) resolvedAgentId = agent.id;
        }

        try {
            const novel = await prisma.novel.create({
                data: {
                    title,
                    description: description || "",
                    pricePerChapter: pricePerChapter || 0.5,
                    agentId: resolvedAgentId,
                    language: (language || "en").toLowerCase(),
                    openForAiLearning: openForAiLearning || false,
                    allowParallelUniverses: allowParallelUniverses || false,
                    freeChaptersCount: freeChaptersCount || 0,
                    usedSkillId: usedSkillId || null,
                    loreId: loreId || null,
                    coverUrl: coverUrl || null,
                    workType: workType || "novel",
                    genre: genre || "其他",
                    humanCollaborator: humanCollaborator || null,
                    humanCollaboratorNote: humanCollaboratorNote || null,
                },
            });
            return NextResponse.json({ novelId: novel.id, title: novel.title, message: "Novel created." }, { status: 201 });
        } catch (error) {
            console.error("MCP NOVEL CREATE PRISMA ERROR: ", error);
            return NextResponse.json({ error: "Failed to create novel in database" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Novel creation failed" }, { status: 500 });
    }
}

// PUT /api/mcp/novels — Update novel metadata (covers)
export async function PUT(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { id, title, coverUrl } = body;

        // SEC-002: Require ID for updates and verify ownership
        if (!id && !title) return NextResponse.json({ error: "id or title required" }, { status: 400 });

        const novel = await prisma.novel.findFirst({ 
            where: { 
                ...(id ? { id } : { title }), 
                agentId: agent.id 
            } 
        });

        if (!novel) return NextResponse.json({ error: "Novel not found or doesn't belong to you" }, { status: 404 });

        await prisma.novel.update({
            where: { id: novel.id },
            data: { coverUrl }
        });

        return NextResponse.json({ message: "Novel updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Novel update error:", error);
        return NextResponse.json({ error: "Novel update failed" }, { status: 500 });
    }
}

// GET /api/mcp/novels — List novels
export async function GET() {
    try {
        const novels = await prisma.novel.findMany({
            include: { agent: { select: { agentName: true } }, _count: { select: { chapters: true } } },
            orderBy: { readCount: "desc" },
        });
        return NextResponse.json({
            novels: novels.map((n: any) => ({
                id: n.id, title: n.title, description: n.description, language: n.language,
                status: n.status, pricePerChapter: n.pricePerChapter, readCount: n.readCount,
                chapterCount: n._count.chapters, agent: n.agent?.agentName || "Unknown",
                workType: n.workType || "novel",
                genre: n.genre || "其他",
                favoriteCount: n.favoriteCount || 0,
                commentCount: n.commentCount || 0,
                tipCount: n.tipCount || 0,
                humanCollaborator: n.humanCollaborator || null,
                humanCollaboratorNote: n.humanCollaboratorNote || null,
            })),
        });
    } catch (error) {
        console.error("Novel fetch error:", error);
        return NextResponse.json({ novels: [] });
    }
}
