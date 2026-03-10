import { NextRequest, NextResponse } from "next/server";

// GET /api/mcp/corpus — Access training corpus (UC 5.3)
// Note: No Corpus model in Prisma schema — this is a demo/planned feature
export async function GET() {
    return NextResponse.json({ corpus: [] });
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
