import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/votes — Vote on work (UC 4.2, 4.3)
// When ≥60% weighted consensus reached → execute 50/30/10/10 revenue split
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");

    try {
        const body = await request.json();
        const { workId, vote, userId, bountyId, comment } = body;
        if (!workId || !vote || !bountyId) {
            return NextResponse.json({ error: "workId, vote, and bountyId required" }, { status: 400 });
        }

        const approved = vote.toUpperCase() === "APPROVE";

        let resolvedUserId = userId || null;
        let resolvedAgentId = null;

        if (apiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (agent) {
                resolvedAgentId = agent.id;
            } else {
                return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
            }
        }

        // Record the vote
        const voteRecord = await prisma.vote.create({
            data: {
                approved,
                workId,
                bountyId,
                userId: resolvedUserId,
                agentId: resolvedAgentId,
            },
        });

            // Check consensus: count all votes for this work
            const allVotes = await prisma.vote.findMany({
                where: { workId, bountyId },
            });

            // Get funding records to calculate weighted votes
            const fundings = await prisma.funding.findMany({
                where: { bountyId },
                include: { user: true, agent: true },
            });

            const totalFunded = fundings.reduce((sum: number, f: any) => sum + f.amount, 0);
            if (totalFunded === 0) {
                return NextResponse.json({
                    voteId: voteRecord.id,
                    vote: approved ? "APPROVE" : "REJECT",
                    message: "Vote recorded. No funding to calculate consensus.",
                }, { status: 201 });
            }

            // Calculate weighted approval percentage
            let approvedWeight = 0;
            let totalVoteWeight = 0;
            for (const v of allVotes) {
                // Find funding for this voter (user or agent)
                const funderFunding = fundings.find(
                    (f: any) => (v.userId && f.userId === v.userId) || (v.agentId && f.agentId === v.agentId)
                );
                const weight = funderFunding ? funderFunding.amount / totalFunded : 0;
                totalVoteWeight += weight;
                if (v.approved) approvedWeight += weight;
            }

            const consensusPct = totalVoteWeight > 0 ? (approvedWeight / totalVoteWeight) * 100 : 0;
            const consensusReached = consensusPct >= 60;

            if (consensusReached) {
                // Execute revenue split: 50/30/10/10
                const bounty = await prisma.bounty.findUnique({
                    where: { id: bountyId },
                    include: { novel: { include: { agent: true } } },
                });

                if (bounty) {
                    const pool = bounty.totalFunded;
                    const creatorShare = pool * 0.50;
                    const fundersShare = pool * 0.30;
                    const loreShare = pool * 0.10;
                    const platformShare = pool * 0.10;

                    // Update bounty status to RESOLVED
                    await prisma.bounty.update({
                        where: { id: bountyId },
                        data: { status: "RESOLVED" },
                    });

                    // Distribute funder share proportionally
                    for (const f of fundings) {
                        const proportion = f.amount / totalFunded;
                        const funderDividend = fundersShare * proportion;
                        if (f.userId) {
                            await prisma.user.update({
                                where: { id: f.userId },
                                data: { usdcBalance: { increment: funderDividend } },
                            });
                        }
                    }

                    return NextResponse.json({
                        voteId: voteRecord.id,
                        vote: approved ? "APPROVE" : "REJECT",
                        consensus: true,
                        consensusPct: Math.round(consensusPct),
                        split: {
                            total: pool,
                            creator: creatorShare,
                            funders: fundersShare,
                            lore: loreShare,
                            platform: platformShare,
                        },
                        message: `✅ Consensus reached (${Math.round(consensusPct)}%). Revenue split executed: 50/30/10/10.`,
                    }, { status: 201 });
                }
            }

            return NextResponse.json({
                voteId: voteRecord.id,
                vote: approved ? "APPROVE" : "REJECT",
                consensus: false,
                consensusPct: Math.round(consensusPct),
                message: `Vote recorded. Consensus: ${Math.round(consensusPct)}% (need 60%).`,
            }, { status: 201 });
        } catch (dbError: any) {
            console.error("VOTE RECORD ERROR:", dbError);
            return NextResponse.json({ 
                error: "Failed to process vote", 
                details: dbError.message 
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Vote failed" }, { status: 500 });
    }
}
