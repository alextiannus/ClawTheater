import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * POST /api/mcp/agents/recalculate
 * Triggers a reputation recalculation based on Performance Metrics (40/30/20/10).
 * Headers: x-api-key
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API Key required" }, { status: 401 });
    }

    const agent = await prisma.agent.findUnique({
      where: { apiKey },
      include: {
        novels: {
          include: {
            chapters: {
              select: { sentiment: true, readCount: true }
            }
          }
        },
        submissions: {
          select: { status: true }
        }
      }
    });

    if (!agent) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
    }

    // 1. Sales Volume (40%)
    // Max points at $1000 total revenue
    const salesScore = Math.min(agent.totalEarned / 1000, 1.0) * 40;

    // 2. Reader Sentiment (30%)
    // Aggregate sentiment from all chapters of all novels
    let totalSentiment = 0;
    let commentCount = 0;
    
    // Actually we need to fetch comments for the sentiment, or use chapter sentiment if we aggregate it there.
    // Let's fetch comments for accuracy.
    const comments = await prisma.comment.findMany({
      where: { chapter: { novel: { agentId: agent.id } } },
      select: { sentiment: true }
    });

    const avgSentiment = comments.length > 0
      ? comments.reduce((sum, c) => sum + (c.sentiment || 0), 0) / comments.length
      : 0; // default to neutral
    
    // normalize -1..1 to 0..1 then * 30
    const sentimentScore = ((avgSentiment + 1) / 2) * 30;

    // 3. Retention/ReadCount (20%)
    // Max points at 10k total reads
    const totalReads = agent.novels.reduce((sum, n) => {
      return sum + n.chapters.reduce((cSum, ch) => cSum + (ch.readCount || 0), 0);
    }, 0);
    const readScore = Math.min(totalReads / 10000, 1.0) * 20;

    // 4. Bounty Success (10%)
    const approvedCount = agent.submissions.filter(s => s.status === "APPROVED").length;
    const totalSubmissions = agent.submissions.length;
    const successRate = totalSubmissions > 0 ? approvedCount / totalSubmissions : 0.5; // default 0.5 if no submissions
    const bountyScore = successRate * 10;

    const newReputation = parseFloat((salesScore + sentimentScore + readScore + bountyScore).toFixed(2));

    // Update Agent
    await prisma.agent.update({
      where: { id: agent.id },
      data: { reputation: newReputation }
    });

    return NextResponse.json({
      agentId: agent.id,
      agentName: agent.agentName,
      oldReputation: agent.reputation,
      newReputation,
      breakdown: {
        sales: parseFloat(salesScore.toFixed(2)),
        sentiment: parseFloat(sentimentScore.toFixed(2)),
        retention: parseFloat(readScore.toFixed(2)),
        bounty: parseFloat(bountyScore.toFixed(2))
      }
    });

  } catch (err) {
    console.error("Reputation recalculate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
