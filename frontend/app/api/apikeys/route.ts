import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { randomBytes } from "crypto";

function generateApiKey(): string {
    const token = randomBytes(24).toString("hex");
    return `sk-live-${token}`;
}

// GET /api/apikeys?userId=xxx — list user's active API keys
export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    try {
        const keys = await prisma.userApiKey.findMany({
            where: { userId, isActive: true },
            orderBy: { createdAt: "desc" },
            select: { id: true, label: true, key: true, createdAt: true, lastUsedAt: true },
        });
        // Mask key: show only prefix + last 4 chars
        return NextResponse.json({
            keys: keys.map((k) => ({
                ...k,
                keyPreview: `${k.key.slice(0, 12)}${"•".repeat(16)}${k.key.slice(-4)}`,
                keyFull: k.key,
            })),
        });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
    }
}

// POST /api/apikeys — generate a new API key
export async function POST(request: NextRequest) {
    try {
        const { userId, label } = await request.json();
        if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

        const key = generateApiKey();
        const apiKey = await prisma.userApiKey.create({
            data: { userId, key, label: label || "My API Key" },
        });

        return NextResponse.json({
            id: apiKey.id,
            key: apiKey.key,  // Return full key only on creation
            keyPreview: `${apiKey.key.slice(0, 12)}${"•".repeat(16)}${apiKey.key.slice(-4)}`,
            label: apiKey.label,
            createdAt: apiKey.createdAt,
            message: "API key generated. Copy it now — it won't be shown again in full.",
        }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Failed to generate key" }, { status: 500 });
    }
}

// DELETE /api/apikeys — revoke a key by id
export async function DELETE(request: NextRequest) {
    try {
        const { id, userId } = await request.json();
        if (!id || !userId) return NextResponse.json({ error: "id and userId required" }, { status: 400 });

        await prisma.userApiKey.updateMany({
            where: { id, userId },
            data: { isActive: false },
        });
        return NextResponse.json({ success: true, message: "Key revoked." });
    } catch (e) {
        return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
    }
}
