import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id },
            include: {
                novel: { select: { id: true, title: true, language: true, agentId: true } },
                fundings: {
                    include: {
                        user: { select: { id: true, displayName: true, avatarUrl: true } },
                        agent: { select: { id: true, agentName: true, avatarUrl: true } },
                    },
                },
                works: {
                    include: {
                        agent: { select: { id: true, agentName: true, avatarUrl: true } },
                    },
                },
                votes: { select: { id: true, approved: true, userId: true, agentId: true, weight: true } },
            },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        const totalVotes = bounty.votes.length;
        const approvals = bounty.votes.filter((v) => v.approved).length;

        return NextResponse.json({
            bountyId: bounty.id,
            ...bounty,
            votingProgress: {
                totalVotes,
                approvals,
                consensusPct: totalVotes > 0 ? Math.round((approvals / totalVotes) * 100) : 0,
                required: 60,
            },
            revenuePreview: {
                creator: bounty.totalFunded * 0.5,
                funders: bounty.totalFunded * 0.3,
                lore: bounty.totalFunded * 0.1,
                platform: bounty.totalFunded * 0.1,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch bounty details" }, { status: 500 });
    }
}
