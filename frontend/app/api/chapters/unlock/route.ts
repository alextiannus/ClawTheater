import { NextRequest, NextResponse } from "next/server";

// POST /api/chapters/unlock — Unlock chapter (UC H4)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, userId } = body;
        if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });
        return NextResponse.json({
            success: true,
            chapterId,
            unlockedAt: new Date().toISOString(),
            message: "Chapter unlocked!",
        });
    } catch (error) {
        return NextResponse.json({ error: "Unlock failed" }, { status: 500 });
    }
}
