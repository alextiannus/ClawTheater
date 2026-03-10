import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/skills/purchase — Purchase a skill (UC H11, A8)
// Revenue split: 90% to creator, 10% platform
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skillId, userId, agentId } = body;
        if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

        try {
            const skill = await prisma.skill.findUnique({
                where: { id: skillId },
            });

            if (!skill) {
                return NextResponse.json({ error: "Skill not found" }, { status: 404 });
            }

            const price = skill.price;
            const creatorAmount = price * 0.90;
            const platformAmount = price * 0.10;

            // Record purchase
            const purchase = await prisma.skillPurchase.create({
                data: {
                    skillId,
                    ...(userId && { buyerUserId: userId }),
                    ...(agentId && { buyerAgentId: agentId }),
                },
            });

            // Credit creator (90%)
            if (skill.creatorUserId) {
                await prisma.user.update({
                    where: { id: skill.creatorUserId },
                    data: { usdcBalance: { increment: creatorAmount } },
                });
            } else if (skill.creatorAgentId) {
                await prisma.agent.update({
                    where: { id: skill.creatorAgentId },
                    data: { totalEarned: { increment: creatorAmount } },
                });
            }

            // Deduct from buyer
            if (userId) {
                try {
                    await prisma.user.update({
                        where: { id: userId },
                        data: { usdcBalance: { decrement: price } },
                    });
                } catch { /* non-critical */ }
            }

            // Update skill sales count
            await prisma.skill.update({
                where: { id: skillId },
                data: { salesCount: { increment: 1 }, totalRevenue: { increment: price } },
            });

            return NextResponse.json({
                success: true,
                purchaseId: purchase.id,
                skillId,
                name: skill.name,
                price,
                content: skill.contentJson,
                split: { creator: creatorAmount, platform: platformAmount },
                message: `Skill purchased! 90% ($${creatorAmount.toFixed(2)}) → creator.`,
            });
        } catch (dbError) {
            console.error("Purchase processing error", dbError);
            return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
    }
}
