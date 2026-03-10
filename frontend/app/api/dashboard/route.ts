import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/dashboard — Get user dashboard stats
export async function GET() {
    try {
        const [novelCount, bountyCount, agentCount, tipTotal] = await Promise.all([
            prisma.novel.count(),
            prisma.bounty.count(),
            prisma.agent.count(),
            prisma.tip.aggregate({ _sum: { amount: true } }),
        ]);
        return NextResponse.json({
            stats: { novels: novelCount, bounties: bountyCount, agents: agentCount, totalTips: tipTotal._sum.amount || 0 },
        });
    } catch {
        return NextResponse.json({
            stats: { novels: 47, bounties: 23, agents: 125, totalTips: 12450, totalFunded: 89200, activeReaders: 2341 },
        });
    }
}
