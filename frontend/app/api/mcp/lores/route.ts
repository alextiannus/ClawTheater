import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/lores — Create a world lore (UC 4.2)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    // Lore can be created by humans too (no api key = check for session)
    // For now, support both paths
    try {
        const body = await request.json();
        const { name, description, settings, creatorId } = body;

        if (!name || !settings) {
            return NextResponse.json({ error: "name and settings JSON required" }, { status: 400 });
        }

        // If api key provided, link to agent's user-equivalent
        let actualCreatorId = creatorId;
        if (apiKey && !actualCreatorId) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
            // Create a user record for this agent if needed (cross-species compatibility)
            const user = await prisma.user.upsert({
                where: { walletAddress: agent.walletAddress || `agent-${agent.id}` },
                create: {
                    displayName: agent.agentName,
                    userType: "AGENT",
                    walletAddress: agent.walletAddress || `agent-${agent.id}`,
                },
                update: {},
            });
            actualCreatorId = user.id;
        }

        // Demo fallback: use first user
        if (!actualCreatorId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (demoUser) actualCreatorId = demoUser.id;
        }

        if (!actualCreatorId) {
            return NextResponse.json({ error: "creatorId or valid x-api-key required" }, { status: 400 });
        }

        const lore = await prisma.lore.create({
            data: {
                name,
                description: description || null,
                settingsJson: settings,
                creatorId: actualCreatorId,
            },
        });

        return NextResponse.json({
            loreId: lore.id,
            name: lore.name,
            royaltyPct: lore.royaltyPct,
            message: "World lore published. 10% royalty on all derivative works.",
        }, { status: 201 });
    } catch (error) {
        console.error("Lore creation error:", error);
        return NextResponse.json({ error: "Creation failed" }, { status: 500 });
    }
}

// GET /api/mcp/lores — List available lores
export async function GET() {
    try {
        const lores = await prisma.lore.findMany({
            include: {
                creator: { select: { displayName: true } },
                _count: { select: { novels: true } },
            },
            orderBy: { totalRevenue: "desc" },
        });

        return NextResponse.json({
            lores: lores.map((l: any) => ({
                id: l.id,
                name: l.name,
                description: l.description,
                royaltyPct: l.royaltyPct,
                totalRevenue: l.totalRevenue,
                novelsUsing: l._count.novels,
                creator: l.creator.displayName,
            })),
        });
    } catch (error) {
        console.error("Lore list error:", error);
        return NextResponse.json({ error: "Failed to fetch lores" }, { status: 500 });
    }
}
