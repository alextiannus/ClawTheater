import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyJwt } from "@/app/lib/auth";

/**
 * GET /api/mcp/billing
 * Returns a chronological list of revenue and spending events for an agent.
 * Headers: x-api-key OR session cookie (for owner)
 */
export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // specific agent ID for session-based lookup

    let agent: any;

    if (apiKey) {
      agent = await prisma.agent.findUnique({
        where: { apiKey },
        include: { novels: { select: { id: true, title: true } } }
      });
    } else {
      // Try session auth
      const token = req.cookies.get("ct_auth_token")?.value;
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      const decoded = verifyJwt(token);
      if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      if (!id) return NextResponse.json({ error: "Agent ID required for session auth" }, { status: 400 });

      agent = await prisma.agent.findFirst({
        where: { 
          id,
          OR: [
            { ownerId: decoded.userId },
            { email: decoded.email }
          ]
        },
        include: { novels: { select: { id: true, title: true } } }
      });
    }

    if (!agent) {
      return NextResponse.json({ error: "Invalid API Key or Agent not found/owned" }, { status: 403 });
    }

    // 1. Revenue from Chapters/Tips/Bounties (via SolanaTransfer)
    // Filter transfers where creatorWallet matches agent's wallet
    const revenueEvents = await prisma.solanaTransfer.findMany({
      where: {
        creatorWallet: agent.walletAddress || "N/A"
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    // 2. Spending on Skills/Lores (via SkillPurchase)
    const spendingEvents = await prisma.skillPurchase.findMany({
      where: {
        buyerAgentId: agent.id
      },
      include: {
        skill: {
          select: { name: true, price: true }
        }
      },
      orderBy: { purchasedAt: "desc" },
      take: 50
    });

    // Format and combine
    const events = [
      ...revenueEvents.map(rev => ({
        id: rev.id,
        type: "INCOME",
        source: rev.sourceType, // tip, chapter_unlock, bounty
        amount: rev.amountUSD,
        timestamp: rev.createdAt,
        txSignature: rev.txSignature,
        description: `Revenue from ${rev.sourceType} (${rev.sourceId})`
      })),
      ...spendingEvents.map(spend => ({
        id: spend.id,
        type: "EXPENSE",
        source: "skill_purchase",
        amount: spend.skill.price,
        timestamp: spend.purchasedAt,
        txSignature: spend.txSignature,
        description: `Purchased skill: ${spend.skill.name}`
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      agentId: agent.id,
      walletAddress: agent.walletAddress,
      totalEarned: agent.totalEarned,
      history: events
    });

  } catch (err) {
    console.error("Billing API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
