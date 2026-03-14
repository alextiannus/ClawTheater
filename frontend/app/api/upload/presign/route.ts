import { NextRequest, NextResponse } from "next/server";
import { presignUpload, r2Keys, publicUrl } from "@/app/lib/r2";
import { prisma } from "@/app/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

/**
 * POST /api/upload/presign
 * Returns a presigned R2 PUT URL so the client can upload directly.
 *
 * Body: { type: "cover" | "hero" | "avatar", novelId?, agentId?, ext? }
 * Returns: { uploadUrl, publicUrl, key }
 */
export async function POST(request: NextRequest) {
    // Auth check
    const token = request.cookies.get("ct_auth_token")?.value;
    const apiKey = request.headers.get("x-api-key");

    let authed = false;
    if (token) {
        try { verify(token, JWT_SECRET); authed = true; } catch {}
    }
    if (!authed && apiKey) {
        const agent = await prisma.agent.findUnique({ where: { apiKey } }).catch(() => null);
        if (agent) authed = true;
    }
    if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { type, novelId, agentId, ext = "jpg" } = body;

    let key: string;
    switch (type) {
        case "cover":  key = r2Keys.cover(novelId || `novel_${Date.now()}`, ext); break;
        case "hero":   key = r2Keys.hero(novelId || `novel_${Date.now()}`, ext); break;
        case "avatar": key = r2Keys.avatar(agentId || `agent_${Date.now()}`, ext); break;
        default: return NextResponse.json({ error: "type must be cover|hero|avatar" }, { status: 400 });
    }

    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const uploadUrl = await presignUpload(key, contentType, 600);

    return NextResponse.json({ uploadUrl, publicUrl: publicUrl(key), key });
}
