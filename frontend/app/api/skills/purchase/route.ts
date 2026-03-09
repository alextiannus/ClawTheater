import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/skills/purchase — Buy a skill (Human UC 6.3 + Agent UC 5.2)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { skillId, userId, agentApiKey } = body;

        if (!skillId) {
            return NextResponse.json({ error: "skillId is required" }, { status: 400 });
        }

        // Determine buyer identity
        let buyerUserId: string | null = null;
        let buyerAgentId: string | null = null;
        let buyerBalance = 0;

        if (agentApiKey) {
            // Agent purchasing
            const agent = await prisma.agent.findUnique({ where: { apiKey: agentApiKey } });
            if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
            buyerAgentId = agent.id;
            buyerBalance = agent.totalEarned; // agents use totalEarned as spendable balance
        } else {
            // Human purchasing — use provided userId or demo user
            let effectiveUserId = userId;
            if (!effectiveUserId) {
                const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
                if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
                effectiveUserId = demoUser.id;
            }
            const user = await prisma.user.findUnique({ where: { id: effectiveUserId } });
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            buyerUserId = user.id;
            buyerBalance = user.usdcBalance;
        }

        // Get skill
        const skill = await prisma.skill.findUnique({ where: { id: skillId } });
        if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

        // Check balance
        if (buyerBalance < skill.price) {
            return NextResponse.json({ error: "Insufficient balance", balance: buyerBalance, price: skill.price }, { status: 400 });
        }

        // Check if already purchased
        const existing = await prisma.skillPurchase.findFirst({
            where: {
                skillId,
                ...(buyerUserId ? { buyerUserId } : {}),
                ...(buyerAgentId ? { buyerAgentId } : {}),
            },
        });
        if (existing) {
            // Already owned — just return the content
            return NextResponse.json({
                success: true,
                alreadyOwned: true,
                skillId: skill.id,
                name: skill.name,
                content: JSON.parse(skill.contentJson),
            });
        }

        // Atomic transaction: deduct balance + create purchase + update seller revenue
        await prisma.$transaction(async (tx) => {
            // Deduct buyer balance
            if (buyerUserId) {
                await tx.user.update({
                    where: { id: buyerUserId },
                    data: { usdcBalance: { decrement: skill.price } },
                });
            }
            // Note: for agents, we skip balance deduction since agent balance tracking
            // is simplified in Phase 1. Full agent wallets come in Phase 2.

            // Create purchase record
            await tx.skillPurchase.create({
                data: {
                    skillId,
                    buyerUserId,
                    buyerAgentId,
                },
            });

            // Update skill stats
            await tx.skill.update({
                where: { id: skillId },
                data: {
                    salesCount: { increment: 1 },
                    totalRevenue: { increment: skill.price },
                },
            });

            // Credit seller
            if (skill.creatorUserId) {
                await tx.user.update({
                    where: { id: skill.creatorUserId },
                    data: { usdcBalance: { increment: skill.price * 0.9 } }, // 90% to creator
                });
            }
            if (skill.creatorAgentId) {
                await tx.agent.update({
                    where: { id: skill.creatorAgentId },
                    data: { totalEarned: { increment: skill.price * 0.9 } },
                });
            }
        });

        return NextResponse.json({
            success: true,
            skillId: skill.id,
            name: skill.name,
            price: skill.price,
            content: JSON.parse(skill.contentJson),
            message: `Purchased "${skill.name}" for ${skill.price} USDC. 90% goes to the creator.`,
        });
    } catch (error) {
        console.error("Skill purchase error:", error);
        return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
    }
}
