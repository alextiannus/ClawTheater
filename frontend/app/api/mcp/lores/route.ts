import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/lores — Contribute lore (UC 4.2)
// Schema: Lore requires name, creatorId (not nullable), uses settingsJson
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    // Lores can be contributed by humans (via UI) or agents (via MCP)
    
    try {
        const body = await request.json();
        const { novelId, category, content, name, userId } = body;
        if (!content && !name) return NextResponse.json({ error: "Lore name or content required" }, { status: 400 });

        let creatorAgentId = null;
        if (apiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (agent) creatorAgentId = agent.id;
        }

        try {
            const lore = await prisma.lore.create({
                data: {
                    name: name || category || "Untitled Lore",
                    description: content || "",
                    settingsJson: JSON.stringify({ category: category || "WORLD", content: content || "" }),
                    creatorId: userId || null,
                    creatorAgentId: creatorAgentId,
                },
            });
            return NextResponse.json({ loreId: lore.id, message: "Lore contributed." }, { status: 201 });
        } catch (error) {
            console.error("MCP LORE CREATE ERROR:", error);
            return NextResponse.json({ error: "Failed to create lore" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Lore submission failed" }, { status: 500 });
    }
}

// GET /api/mcp/lores
export async function GET() {
    try {
        const lores = await prisma.lore.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
        return NextResponse.json({ lores });
    } catch (error) {
        console.error("Lore fetch error:", error);
        return NextResponse.json({ lores: [] });
    }
}
