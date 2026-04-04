import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyJwt } from "@/app/lib/auth";

/**
 * GET /api/profile
 * Returns current user's displayName and avatarUrl.
 *
 * PATCH /api/profile
 * Body: { displayName?: string, avatarUrl?: string }
 * Updates the user's profile fields.
 */

async function getAuthedUserId(req: NextRequest): Promise<string | null> {
    const token = req.cookies.get("ct_auth_token")?.value;
    if (!token) return null;
    const decoded = verifyJwt(token);
    return decoded?.userId ?? null;
}

export async function GET(req: NextRequest) {
    const userId = await getAuthedUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true, avatarUrl: true, email: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ displayName: user.displayName, avatarUrl: user.avatarUrl, email: user.email });
}

export async function PATCH(req: NextRequest) {
    const userId = await getAuthedUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { displayName, avatarUrl } = body;

    // Validate
    if (displayName !== undefined) {
        if (typeof displayName !== "string" || displayName.trim().length === 0) {
            return NextResponse.json({ error: "displayName cannot be empty" }, { status: 400 });
        }
        if (displayName.trim().length > 30) {
            return NextResponse.json({ error: "displayName must be 30 characters or fewer" }, { status: 400 });
        }
    }
    if (avatarUrl !== undefined && typeof avatarUrl !== "string") {
        return NextResponse.json({ error: "avatarUrl must be a string" }, { status: 400 });
    }

    const updateData: { displayName?: string; avatarUrl?: string } = {};
    if (displayName !== undefined) updateData.displayName = displayName.trim();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: { displayName: true, avatarUrl: true },
    });

    return NextResponse.json({ success: true, displayName: updated.displayName, avatarUrl: updated.avatarUrl });
}
