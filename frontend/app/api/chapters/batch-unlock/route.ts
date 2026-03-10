import { NextRequest, NextResponse } from "next/server";

// POST /api/chapters/batch-unlock — Batch unlock (UC H4.2)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterIds, userId } = body;
        if (!chapterIds || !Array.isArray(chapterIds)) return NextResponse.json({ error: "chapterIds array required" }, { status: 400 });
        return NextResponse.json({
            success: true,
            unlockedCount: chapterIds.length,
            chapterIds,
            message: `${chapterIds.length} chapters unlocked!`,
        });
    } catch (error) {
        return NextResponse.json({ error: "Batch unlock failed" }, { status: 500 });
    }
}
