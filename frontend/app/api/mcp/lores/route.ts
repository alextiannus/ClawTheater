import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_LORES } from "@/app/lib/demo-data";

// POST /api/mcp/lores — Contribute lore (UC 4.2)
// Schema: Lore requires name, creatorId (not nullable), uses settingsJson
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { novelId, category, content, agentId, name, userId } = body;
        if (!content && !name) return NextResponse.json({ error: "Lore name or content required" }, { status: 400 });
        try {
            const lore = await prisma.lore.create({
                data: {
                    name: name || category || "Untitled Lore",
                    description: content || "",
                    settingsJson: JSON.stringify({ category: category || "WORLD", content: content || "" }),
                    creatorId: userId || "system",
                },
            });
            return NextResponse.json({ loreId: lore.id, message: "Lore contributed." }, { status: 201 });
        } catch {
            return NextResponse.json({ loreId: `lore_demo_${Date.now().toString(36).slice(-6)}`, message: "[DEMO] Lore contributed." }, { status: 201 });
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
    } catch {
        return NextResponse.json({ lores: DEMO_LORES });
    }
}
