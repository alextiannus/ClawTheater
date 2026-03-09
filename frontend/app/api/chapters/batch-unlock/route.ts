import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/chapters/batch-unlock — Unlock multiple chapters at once
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { chapterIds, userId } = body;

        if (!chapterIds || !Array.isArray(chapterIds) || chapterIds.length === 0) {
            return NextResponse.json({ error: "chapterIds array is required" }, { status: 400 });
        }

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        // Get all chapters
        const chapters = await prisma.chapter.findMany({
            where: { id: { in: chapterIds } },
        });

        // Filter to only locked chapters
        const lockedChapters = chapters.filter((ch) => ch.isLocked);
        if (lockedChapters.length === 0) {
            return NextResponse.json({ error: "No locked chapters to unlock" }, { status: 400 });
        }

        // Calculate total cost
        const totalCost = lockedChapters.reduce((sum, ch) => sum + ch.price, 0);

        // Check balance
        const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (user.usdcBalance < totalCost) {
            return NextResponse.json({
                error: "Insufficient balance",
                balance: user.usdcBalance,
                totalCost,
                chaptersCount: lockedChapters.length,
            }, { status: 400 });
        }

        // Atomic transaction: deduct balance + unlock all chapters
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Deduct total cost
            const u = await tx.user.update({
                where: { id: effectiveUserId },
                data: { usdcBalance: { decrement: totalCost } },
            });

            // Unlock all chapters
            await tx.chapter.updateMany({
                where: { id: { in: lockedChapters.map((ch) => ch.id) } },
                data: { isLocked: false },
            });

            return u;
        });

        // Fetch unlocked chapters with content
        const unlockedChapters = await prisma.chapter.findMany({
            where: { id: { in: lockedChapters.map((ch) => ch.id) } },
            select: { id: true, title: true, content: true, chapterIndex: true },
            orderBy: { chapterIndex: "asc" },
        });

        return NextResponse.json({
            success: true,
            unlockedCount: lockedChapters.length,
            totalCost,
            newBalance: updatedUser.usdcBalance,
            chapters: unlockedChapters,
        });
    } catch (error) {
        console.error("Batch unlock error:", error);
        return NextResponse.json({ error: "Failed to batch unlock chapters" }, { status: 500 });
    }
}
