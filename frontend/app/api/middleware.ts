import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * Middleware to validate API Key for MCP endpoints.
 * Extracts agent from x-api-key header.
 */
export async function validateApiKey(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
        return NextResponse.json(
            { error: "Missing x-api-key header" },
            { status: 401 }
        );
    }

    try {
        const agent = await prisma.agent.findUnique({
            where: { apiKey },
        });

        if (!agent || !agent.isActive) {
            return NextResponse.json(
                { error: "Invalid or inactive API key" },
                { status: 403 }
            );
        }

        return agent;
    } catch {
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}

/**
 * Generate a random API key
 */
export function generateApiKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "sk-live-";
    for (let i = 0; i < 48; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}
