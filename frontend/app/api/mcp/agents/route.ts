import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const AVATAR_COUNT = 8;
const AVATAR_STYLES = [
    "manga", "manga", "cyberpunk", "cyberpunk",
    "oil-painting", "oil-painting", "ink-painting", "ink-painting"
];

function generateApiKey(): string {
    return `sk-live-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function pickAvatar(seed?: string): string {
    // Deterministic pick if seed given, otherwise random
    const idx = seed
        ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COUNT
        : Math.floor(Math.random() * AVATAR_COUNT);
    return `/avatars/lobster-${idx + 1}.png`;
}

// POST /api/mcp/agents — Register new agent (UC 1.1)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, walletAddress, systemPrompt, avatarStyle } = body;

        if (!name) {
            return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
        }

        const apiKey = generateApiKey();

        try {
            const existingAgent = await prisma.agent.findFirst({
                where: { agentName: name },
            });

            if (existingAgent) {
                return NextResponse.json({
                    agentId: existingAgent.id,
                    apiKey: existingAgent.apiKey,
                    name: existingAgent.agentName,
                    avatarUrl: existingAgent.avatarUrl,
                    message: "Agent already exists. Returning existing credentials.",
                }, { status: 200 });
            }

            // Auto-assign lobster avatar based on name seed
            const avatarUrl = pickAvatar(name);

            const agent = await prisma.agent.create({
                data: {
                    agentName: name,
                    description: description || null,
                    walletAddress: walletAddress || null,
                    systemPrompt: systemPrompt || null,
                    avatarUrl,
                    apiKey,
                },
            });

            return NextResponse.json({
                agentId: agent.id,
                apiKey: agent.apiKey,
                name: agent.agentName,
                avatarUrl: agent.avatarUrl,
                avatarStyle: AVATAR_STYLES[parseInt(avatarUrl.match(/\d+/)?.[0] || "1") - 1],
                message: "Agent registered successfully. Store your API key securely.",
            }, { status: 201 });
        } catch (error) {
            console.error("Agent creation DB error:", error);
            return NextResponse.json({ error: "Failed to register agent in database" }, { status: 500 });
        }
    } catch (error) {
        console.error("Agent registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

// PUT /api/mcp/agents — Update agent profile (UC 1.2, 1.3)
export async function PUT(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    try {
        const body = await request.json();
        const { walletAddress, agentName, description, avatarIndex, avatarUrl: customAvatarUrl } = body;

        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const updateData: any = {};
        if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
        if (agentName !== undefined) updateData.agentName = agentName;
        if (description !== undefined) updateData.description = description;
        // UC 1.4a: Custom avatar — provide own image URL or base64 data URI
        if (customAvatarUrl !== undefined) {
            updateData.avatarUrl = customAvatarUrl;
        } else if (avatarIndex !== undefined) {
            // UC 1.4b: Pick from 8 preset lobster avatars
            const idx = Math.max(1, Math.min(8, parseInt(avatarIndex) || 1));
            updateData.avatarUrl = `/avatars/lobster-${idx}.png`;
        }

        const updated = await prisma.agent.update({
            where: { id: agent.id },
            data: updateData,
        });
        return NextResponse.json({
            agentId: updated.id,
            agentName: updated.agentName,
            walletAddress: updated.walletAddress,
            avatarUrl: updated.avatarUrl,
            message: "Agent profile updated.",
        });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// GET /api/mcp/agents — Get agent profile by apiKey (UC 7.1)
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key") || request.nextUrl.searchParams.get("apiKey");
    const agentId = request.nextUrl.searchParams.get("agentId");

    try {
        const agent = agentId
            ? await prisma.agent.findUnique({ where: { id: agentId } })
            : apiKey ? await prisma.agent.findUnique({ where: { apiKey } }) : null;

        if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

        return NextResponse.json({
            agentId: agent.id,
            agentName: agent.agentName,
            description: agent.description,
            avatarUrl: agent.avatarUrl,
            walletAddress: agent.walletAddress,
            reputation: agent.reputation,
            totalEarned: agent.totalEarned,
            creatorTier: agent.creatorTier,
        });
    } catch (error) {
        return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }
}
