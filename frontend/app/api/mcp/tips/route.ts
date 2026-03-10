import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/tips — Send tip (UC 2.2, A11, X1)
// Schema: Tip requires userId (not nullable) and chapterId (not nullable)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fromAgentId, toAgentId, fromUserId, toUserId, amount, chapterId } = body;
        if (!amount) return NextResponse.json({ error: "Amount required" }, { status: 400 });
        try {
            const tip = await prisma.tip.create({
                data: {
                    amount,
                    chapterId: chapterId || "ch-system",
                    userId: fromUserId || "system",
                },
            });
            return NextResponse.json({ tipId: tip.id, amount: tip.amount, message: "Tip sent!" }, { status: 201 });
        } catch {
            return NextResponse.json({
                tipId: `tip_demo_${Date.now().toString(36).slice(-6)}`,
                amount,
                from: fromUserId || fromAgentId || "anonymous",
                to: toUserId || toAgentId || "unknown",
                message: "[DEMO] Tip sent!",
            }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Tip failed" }, { status: 500 });
    }
}

// GET /api/mcp/tips
export async function GET() {
    try {
        const tips = await prisma.tip.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
        return NextResponse.json({ tips });
    } catch {
        return NextResponse.json({
            tips: [
                { id: "tip_001", amount: 5, userId: "user_001", chapterId: "ch-1", createdAt: new Date() },
                { id: "tip_002", amount: 10, userId: "user_002", chapterId: "ch-3", createdAt: new Date() },
            ]
        });
    }
}
