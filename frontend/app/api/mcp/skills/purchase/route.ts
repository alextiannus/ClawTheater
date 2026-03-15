import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { checkAndPromoteAgentTier } from "@/app/lib/tier-promotion";

// POST /api/mcp/skills/purchase — Agent purchases a skill (UC-S3, Agent Flow)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const buyer = await prisma.agent.findUnique({ where: { apiKey } });
        if (!buyer) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { skillId } = body;
        if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

        const skill = await prisma.skill.findUnique({ where: { id: skillId } });
        if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

        // Prevent self-purchase
        if (skill.creatorAgentId === buyer.id) {
            return NextResponse.json({ error: "Cannot purchase your own skill" }, { status: 400 });
        }

        const price = skill.price;
        const creatorAmount = price * 0.90;
        const platformAmount = price * 0.10;

        // Handle paid skills: check balance
        if (!skill.isOpenSource && price > 0) {
            if (buyer.totalEarned < price) {
                return NextResponse.json({
                    error: "Insufficient balance",
                    required: price,
                    available: buyer.totalEarned,
                }, { status: 402 });
            }
            // Deduct from buyer
            await prisma.agent.update({
                where: { id: buyer.id },
                data: { totalEarned: { decrement: price } },
            });
        }

        // Record purchase
        await prisma.skillPurchase.create({
            data: { skillId, buyerAgentId: buyer.id },
        });

        // Credit creator (human or agent, 90%)
        if (skill.creatorAgentId && !skill.isOpenSource) {
            await prisma.agent.update({
                where: { id: skill.creatorAgentId },
                data: { totalEarned: { increment: creatorAmount } },
            });
            checkAndPromoteAgentTier(skill.creatorAgentId).catch(() => {});
        } else if (skill.creatorUserId && !skill.isOpenSource) {
            await prisma.user.update({
                where: { id: skill.creatorUserId },
                data: { usdcBalance: { increment: creatorAmount } },
            });
        }

        // Update skill stats
        await prisma.skill.update({
            where: { id: skillId },
            data: {
                salesCount: { increment: 1 },
                totalRevenue: { increment: price },
            },
        });

        // Parse & return content (UC-S4: Zero Friction delivery)
        let content: any = null;
        try {
            content = JSON.parse(skill.contentJson || "{}");
        } catch {
            content = { raw: skill.contentJson };
        }

        return NextResponse.json({
            success: true,
            skillId,
            name: skill.name,
            price,
            isOpenSource: skill.isOpenSource,
            content,
            split: skill.isOpenSource
                ? { message: "Free skill — no transfer needed." }
                : { creator: creatorAmount, platform: platformAmount },
            message: skill.isOpenSource
                ? `Free skill "${skill.name}" downloaded.`
                : `Skill purchased! 90% ($${creatorAmount.toFixed(2)}) → creator.`,
        });
    } catch (error) {
        console.error("Skill purchase error:", error);
        return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
    }
}
