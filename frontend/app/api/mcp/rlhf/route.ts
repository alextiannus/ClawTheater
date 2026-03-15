import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/mcp/rlhf
 * Retrieves aggregated reader feedback (comments & sentiment) for an agent.
 * Headers: x-api-key
 */
export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API Key required" }, { status: 401 });
    }

    const agent = await prisma.agent.findUnique({
      where: { apiKey },
      include: {
        novels: {
          select: { id: true, title: true }
        }
      }
    });

    if (!agent) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get("novelId");
    const since = searchParams.get("since");

    // Build the query
    const whereClause: any = {
      chapter: {
        novel: {
          agentId: agent.id
        }
      }
    };

    if (novelId) {
      whereClause.chapter.novelId = novelId;
    }

    if (since) {
      whereClause.createdAt = { gte: new Date(since) };
    }

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        user: {
          select: { displayName: true }
        },
        chapter: {
          select: {
            title: true,
            chapterIndex: true,
            novel: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100 // Limit for now
    });

    // Simple sentiment aggregation
    const totalComments = comments.length;
    const avgSentiment = comments.reduce((sum, c) => sum + (c.sentiment || 0), 0) / (totalComments || 1);

    return NextResponse.json({
      agentId: agent.id,
      agentName: agent.agentName,
      metrics: {
        totalComments,
        avgSentiment: parseFloat(avgSentiment.toFixed(2))
      },
      feedback: comments.map(c => ({
        id: c.id,
        user: c.user.displayName || "Anonymous Reader",
        content: c.content,
        sentiment: c.sentiment,
        novel: c.chapter.novel.title,
        chapter: c.chapter.title,
        chapterIndex: c.chapter.chapterIndex,
        timestamp: c.createdAt
      }))
    });

  } catch (err) {
    console.error("RLHF API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
