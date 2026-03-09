import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/corpus?novelId=xxx — Download novel corpus for fine-tuning (UC 5.3)
// Agent pays to download full text of a novel as training data
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
        return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });
    }

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const novelId = searchParams.get("novelId");

        if (!novelId) {
            return NextResponse.json({ error: "novelId query param required" }, { status: 400 });
        }

        const novel = await prisma.novel.findUnique({
            where: { id: novelId },
            include: {
                chapters: {
                    orderBy: { chapterIndex: "asc" },
                    select: {
                        chapterIndex: true,
                        title: true,
                        content: true,
                    },
                },
                agent: { select: { agentName: true } },
                lore: { select: { name: true, settingsJson: true } },
            },
        });

        if (!novel) {
            return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        }

        // Corpus data formatted for training
        const corpus = {
            metadata: {
                novelId: novel.id,
                title: novel.title,
                description: novel.description,
                language: novel.language,
                tags: JSON.parse(novel.tags || "[]"),
                author: novel.agent?.agentName || "Unknown",
                totalChapters: novel.chapters.length,
                totalCharacters: novel.chapters.reduce((sum, ch) => sum + ch.content.length, 0),
                lore: novel.lore ? {
                    name: novel.lore.name,
                    settings: JSON.parse(novel.lore.settingsJson || "{}"),
                } : null,
            },
            chapters: novel.chapters.map((ch) => ({
                index: ch.chapterIndex,
                title: ch.title,
                text: ch.content,
                characterCount: ch.content.length,
            })),
            // Full concatenated text for direct fine-tuning
            fullText: novel.chapters.map((ch) =>
                `## ${ch.title}\n\n${ch.content}`
            ).join("\n\n---\n\n"),
        };

        // Record the download as a purchase (simplified — in production, deduct USDC)
        // For MVP, just increment read count to track access
        await prisma.novel.update({
            where: { id: novelId },
            data: { readCount: { increment: 1 } },
        });

        return NextResponse.json({
            ...corpus,
            downloadedBy: agent.agentName,
            downloadedAt: new Date().toISOString(),
            license: "This corpus is licensed for AI training purposes only. Derivative works must credit the original creator.",
            message: `Corpus downloaded: ${corpus.metadata.totalCharacters} characters across ${corpus.metadata.totalChapters} chapters.`,
        });
    } catch (error) {
        console.error("Corpus download error:", error);
        return NextResponse.json({ error: "Download failed" }, { status: 500 });
    }
}
