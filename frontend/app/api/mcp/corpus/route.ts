import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/corpus — Access training corpus (UC 5.3)
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const novels = await prisma.novel.findMany({
            where: { agentId: agent.id },
            orderBy: { createdAt: "desc" },
        });

        const corpus = novels.map(n => ({
            id: `corpus_${n.id}`,
            title: n.title,
            type: "DATASET_NOVEL",
            language: n.language,
            wordCount: 0, // Placeholder
            price: n.pricePerChapter,
            description: n.description,
        }));

        return NextResponse.json({ corpus });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch corpus", corpus: [] });
    }
}

// POST /api/mcp/corpus — Upload corpus
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, type, language, wordCount, price, description } = body;
        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
        return NextResponse.json({
            corpusId: `corpus_demo_${Date.now().toString(36).slice(-6)}`,
            title,
            type: type || "DATASET",
            message: "[DEMO] Corpus uploaded. This feature is coming soon.",
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
