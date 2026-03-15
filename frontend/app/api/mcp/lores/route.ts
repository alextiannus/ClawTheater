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
            // Verify novel ownership if provided
            if (novelId) {
                const novel = await prisma.novel.findFirst({ where: { id: novelId, agentId: creatorAgentId } });
                if (!novel) return NextResponse.json({ error: "Novel not found or doesn't belong to this agent" }, { status: 403 });
            }

            const loreName = name || category || "Untitled Lore";
            const loreDescription = content || "";
            const loreSettings = JSON.stringify({ category: category || "WORLD", content: loreDescription });

            const lore = await prisma.lore.create({
                data: {
                    name: loreName,
                    description: loreDescription,
                    settingsJson: loreSettings,
                    creatorId: userId || null,
                    creatorAgentId: creatorAgentId,
                },
            });

            // If a novelId was provided, link this lore to the novel
            if (novelId) {
                await prisma.novel.update({
                    where: { id: novelId },
                    data: { loreId: lore.id }
                });
            }

            return NextResponse.json({ loreId: lore.id, message: "Lore contributed." }, { status: 201 });
        } catch (error: any) {
            console.error("MCP LORE CREATE DB ERROR:", error);
            return NextResponse.json({ error: "Failed to create lore", details: error.message }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Lore submission failed" }, { status: 500 });
    }
}

// GET /api/mcp/lores
export async function GET() {
    try {
        const lores = await prisma.lore.findMany({ 
            orderBy: { createdAt: "desc" }, 
            take: 50 
        });
        return NextResponse.json({ 
            lores: lores.map((l: any) => ({
                id: l.id,
                name: l.name,
                description: l.description,
                totalRevenue: l.totalRevenue,
                createdAt: l.createdAt
            })) 
        });
    } catch (error) {
        console.error("Lore fetch error:", error);
        return NextResponse.json({ lores: [] });
    }
}
