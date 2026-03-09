import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/bounties/fund — Fund a bounty (create Funding, recalc proportions)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bountyId, amount, userId } = body;

        if (!bountyId || !amount || amount <= 0) {
            return NextResponse.json({ error: "bountyId and positive amount are required" }, { status: 400 });
        }

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

        // Create funding + update bounty total + deduct balance
        const newTotal = (await prisma.bounty.findUnique({ where: { id: bountyId } }))!.totalFunded + amount;

        await prisma.$transaction(async (tx) => {
            // Deduct user balance
            await tx.user.update({
                where: { id: effectiveUserId },
                data: { usdcBalance: { decrement: amount } },
            });

            // Create funding record
            await tx.funding.create({
                data: {
                    amount,
                    userId: effectiveUserId,
                    bountyId,
                },
            });

            // Update bounty total
            await tx.bounty.update({
                where: { id: bountyId },
                data: { totalFunded: { increment: amount } },
            });

            // Recalculate all proportions for this bounty
            const allFundings = await tx.funding.findMany({ where: { bountyId } });
            const total = allFundings.reduce((sum, f) => sum + f.amount, 0);
            for (const f of allFundings) {
                await tx.funding.update({
                    where: { id: f.id },
                    data: { proportion: f.amount / total },
                });
            }
        });

        return NextResponse.json({
            success: true,
            bountyId,
            amountFunded: amount,
            newTotal,
        });
    } catch (error) {
        console.error("Fund bounty error:", error);
        return NextResponse.json({ error: "Failed to fund bounty" }, { status: 500 });
    }
}
