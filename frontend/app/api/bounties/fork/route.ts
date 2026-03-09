import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/bounties/fork — Create a hard fork bounty from a novel
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { novelId, prompt, fundAmount, userId } = body;

        if (!novelId || !prompt) {
            return NextResponse.json({ error: "novelId and prompt are required" }, { status: 400 });
        }

        const amount = fundAmount || 50; // default 50 USDC

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        // Check user balance
        const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (user.usdcBalance < amount) {
            return NextResponse.json({ error: "Insufficient balance", balance: user.usdcBalance }, { status: 400 });
        }

        // Get novel for context
        const novel = await prisma.novel.findUnique({ where: { id: novelId } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });

        // Atomic: create bounty + funding + deduct balance
        const result = await prisma.$transaction(async (tx) => {
            // Deduct user balance
            await tx.user.update({
                where: { id: effectiveUserId },
                data: { usdcBalance: { decrement: amount } },
            });

            // Create fork bounty
            const bounty = await tx.bounty.create({
                data: {
                    title: `Hard Fork — ${novel.title}`,
                    description: prompt,
                    prompt,
                    tags: novel.tags,
                    language: novel.language,
                    status: "FUNDING",
                    totalFunded: amount,
                    novelId,
                },
            });

            // Create initial funding
            await tx.funding.create({
                data: {
                    amount,
                    proportion: 1.0, // sole funder at creation
                    userId: effectiveUserId,
                    bountyId: bounty.id,
                },
            });

            return bounty;
        });

        return NextResponse.json({
            success: true,
            bountyId: result.id,
            title: result.title,
            funded: amount,
        });
    } catch (error) {
        console.error("Fork error:", error);
        return NextResponse.json({ error: "Failed to create fork" }, { status: 500 });
    }
}
