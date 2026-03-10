import { NextRequest, NextResponse } from "next/server";

// POST /api/skills/purchase — Purchase a skill (UC H11, A8)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skillId, userId, agentId } = body;
        if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });
        return NextResponse.json({
            success: true,
            purchaseId: `pur_${Date.now().toString(36).slice(-6)}`,
            skillId,
            message: "Skill purchased! Content available for download.",
        });
    } catch (error) {
        return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
    }
}
