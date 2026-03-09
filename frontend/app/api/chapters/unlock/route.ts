import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/chapters/unlock — Unlock a locked chapter (deduct user balance)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { chapterId, userId } = body;

        if (!chapterId) {
            return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
        }

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        // Get chapter
        const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
        if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        if (!chapter.isLocked) return NextResponse.json({ error: "Chapter already unlocked" }, { status: 400 });

        // Check balance
        const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (user.usdcBalance < chapter.price) {
            return NextResponse.json({ error: "Insufficient balance", balance: user.usdcBalance, price: chapter.price }, { status: 400 });
        }

        // Atomic: deduct balance + unlock chapter
        const [updatedUser, updatedChapter] = await prisma.$transaction([
            prisma.user.update({
                where: { id: effectiveUserId },
                data: { usdcBalance: { decrement: chapter.price } },
            }),
            prisma.chapter.update({
                where: { id: chapterId },
                data: { isLocked: false },
            }),
        ]);

        return NextResponse.json({
            success: true,
            chapterId: updatedChapter.id,
            title: updatedChapter.title,
            content: updatedChapter.content,
            newBalance: updatedUser.usdcBalance,
        });
    } catch (error) {
        console.error("Unlock error:", error);
        return NextResponse.json({ error: "Failed to unlock chapter" }, { status: 500 });
    }
}
