import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/tips — Micro-tip a chapter (Human UC 2.2 / Scenario C: 90/10)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, userId, amount, txSignature } = body;

        if (!chapterId || !userId || !amount) {
            return NextResponse.json({ error: "chapterId, userId, and amount required" }, { status: 400 });
        }

        const tip = await prisma.tip.create({
            data: {
                amount,
                chapterId,
                userId,
                txSignature: txSignature || null,
            },
        });

        // Update chapter read count
        await prisma.chapter.update({
            where: { id: chapterId },
            data: { readCount: { increment: 1 } },
        });

        return NextResponse.json({
            tipId: tip.id,
            amount: tip.amount,
            split: { creator: "90%", platform: "10%" },
            message: `⚡ Tipped ${amount} USDC! 90% goes to the creator.`,
        }, { status: 201 });
    } catch (error) {
        console.error("Tip error:", error);
        return NextResponse.json({ error: "Tipping failed" }, { status: 500 });
    }
}

// POST /api/mcp/fund — Fund a bounty (Human UC 3.2 & 4.1 / Agent UC 6.2)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { bountyId, amount, userId, agentApiKey, txSignature } = body;

        if (!bountyId || !amount) {
            return NextResponse.json({ error: "bountyId and amount required" }, { status: 400 });
        }

        const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } });
        if (!bounty) return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        if (bounty.status !== "FUNDING") {
            return NextResponse.json({ error: "Bounty not accepting funds" }, { status: 400 });
        }

        // Determine funder identity
        let funderId: string | null = userId || null;
        let agentId: string | null = null;

        if (agentApiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey: agentApiKey } });
            if (agent) agentId = agent.id;
        }

        // Create funding record
        const funding = await prisma.funding.create({
            data: {
                amount,
                userId: funderId,
                agentId,
                bountyId,
                txSignature: txSignature || null,
            },
        });

        // Update bounty total
        const newTotal = bounty.totalFunded + amount;
        await prisma.bounty.update({
            where: { id: bountyId },
            data: { totalFunded: newTotal },
        });

        // Recalculate proportions for all funders
        const allFundings = await prisma.funding.findMany({ where: { bountyId } });
        for (const f of allFundings) {
            await prisma.funding.update({
                where: { id: f.id },
                data: { proportion: f.amount / newTotal },
            });
        }

        return NextResponse.json({
            fundingId: funding.id,
            amount,
            newTotal,
            proportion: amount / newTotal,
            message: `💰 Funded ${amount} USDC. Total pool: ${newTotal} USDC.`,
        });
    } catch (error) {
        console.error("Funding error:", error);
        return NextResponse.json({ error: "Funding failed" }, { status: 500 });
    }
}
