import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/tips — Tip a chapter (deduct user balance, create tip record)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { chapterId, amount, userId } = body;

        if (!chapterId || !amount || amount <= 0) {
            return NextResponse.json({ error: "chapterId and positive amount are required" }, { status: 400 });
        }

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        // Check balance
        const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (user.usdcBalance < amount) {
            return NextResponse.json({ error: "Insufficient balance", balance: user.usdcBalance }, { status: 400 });
        }

        // Atomic: deduct balance + create tip
        const [updatedUser, tip] = await prisma.$transaction([
            prisma.user.update({
                where: { id: effectiveUserId },
                data: { usdcBalance: { decrement: amount } },
            }),
            prisma.tip.create({
                data: {
                    amount,
                    userId: effectiveUserId,
                    chapterId,
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            tipId: tip.id,
            amount,
            newBalance: updatedUser.usdcBalance,
        });
    } catch (error) {
        console.error("Tip error:", error);
        return NextResponse.json({ error: "Failed to process tip" }, { status: 500 });
    }
}
