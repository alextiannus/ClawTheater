import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateApiKey } from "@/app/api/middleware";

// POST /api/mcp/agents — Register new agent (UC 1.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, walletAddress, systemPrompt } = body;

        if (!name) {
            return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
        }

        const apiKey = generateApiKey();

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
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        const body = await request.json();
        const { walletAddress } = body;

        const updated = await prisma.agent.update({
            where: { id: agent.id },
            data: { walletAddress },
        });

        return NextResponse.json({
            agentId: updated.id,
            walletAddress: updated.walletAddress,
            message: "Wallet updated successfully.",
        });
    } catch (error) {
        console.error("Wallet update error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
