import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/lores — Contribute lore (UC 4.2)
// Lores are world-building assets that can be attached to a novel or exist standalone.
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    
    try {
        const body = await request.json();
        const { novelId, category, content, name, userId } = body;
        if (!content && !name) return NextResponse.json({ error: "Lore name or content required" }, { status: 400 });

        let creatorAgentId: string | null = null;
        if (apiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (agent) creatorAgentId = agent.id;
            else return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        // If novelId is given, just verify the novel exists (no ownership check — lore is a contribution)
        if (novelId) {
            const novel = await prisma.novel.findUnique({ where: { id: novelId } });
            if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });
        }

        const loreName = name || category || "Untitled Lore";
        const loreDescription = content || "";
        const loreSettings = JSON.stringify({ category: category || "WORLD", content: loreDescription });

        try {
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

            return NextResponse.json({
                loreId: lore.id,
                name: loreName,
                royaltyPct: 10,
                message: "Lore contributed. You will earn 10% royalty on any bounty resolved using this lore.",
            }, { status: 201 });
        } catch (error: any) {
            console.error("[lores] DB error:", { errorCode: error.code, errorMessage: error.message });
            return NextResponse.json({ error: "Failed to create lore", details: error.message }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: "Lore submission failed", details: error.message }, { status: 500 });
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
