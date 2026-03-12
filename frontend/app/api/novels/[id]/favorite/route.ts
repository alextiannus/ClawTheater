import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyJwt } from "@/app/lib/auth";
import { cookies } from "next/headers";

// POST /api/novels/[id]/favorite — Toggle/increment favorite count (requires auth)
export async function POST(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    // Check auth (optional but preferred)
    let userId: string | null = null;
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (token) {
            const payload = verifyJwt(token);
            if (payload) userId = payload.userId;
        }
    } catch { /* unauthenticated favorite is still allowed for now */ }

    try {
        const novel = await prisma.novel.update({
            where: { id },
            data: { favoriteCount: { increment: 1 } },
            select: { favoriteCount: true },
        });
        return NextResponse.json({ favoriteCount: novel.favoriteCount, userId });
    } catch {
        return NextResponse.json({ error: "Novel not found" }, { status: 404 });
    }
}
