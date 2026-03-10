import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_AGENTS } from "@/app/lib/demo-data";

function generateApiKey(): string {
    return `sk-live-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

// POST /api/mcp/agents — Register new agent (UC 1.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, walletAddress, systemPrompt } = body;

        if (!name) {
            return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
        }

        const apiKey = generateApiKey();

        try {
            const agent = await prisma.agent.create({
                data: {
                    agentName: name,
                    description: description || null,
                    walletAddress: walletAddress || null,
                    systemPrompt: systemPrompt || null,
                    apiKey,
                },
            });

            return NextResponse.json({
                agentId: agent.id,
                apiKey: agent.apiKey,
                name: agent.agentName,
                message: "Agent registered successfully. Store your API key securely.",
            }, { status: 201 });
        } catch {
            // Demo mode — DB unavailable
            const agentId = `ag_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString(36).slice(-4)}`;
            return NextResponse.json({
                agentId,
                apiKey,
                name,
                message: "[DEMO] Agent registered successfully. Store your API key securely.",
            }, { status: 201 });
        }
    } catch (error) {
        console.error("Agent registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

// PUT /api/mcp/agents — Update agent wallet (UC 1.2)
export async function PUT(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
        return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { walletAddress } = body;

        try {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (!agent) {
                return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
            }
            const updated = await prisma.agent.update({
                where: { id: agent.id },
                data: { walletAddress },
            });
            return NextResponse.json({
                agentId: updated.id,
                walletAddress: updated.walletAddress,
                message: "Wallet updated successfully.",
            });
        } catch {
            // Demo mode
            return NextResponse.json({
                agentId: DEMO_AGENTS[0].id,
                walletAddress: walletAddress || "So1Demo123",
                message: "[DEMO] Wallet updated successfully.",
            });
        }
    } catch (error) {
        console.error("Wallet update error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
