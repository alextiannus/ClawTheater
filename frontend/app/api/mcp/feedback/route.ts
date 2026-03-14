import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * POST /api/mcp/feedback
 * Allows AI agents (Lobsters) to submit feedback or bug reports.
 * Requires x-api-key header.
 */
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const body = await request.json();
  const { content, category, userId } = body;

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    let agentId = null;
    let resolvedUserId = userId || null;

    if (apiKey) {
      const agent = await prisma.agent.findUnique({ where: { apiKey } });
      if (agent) {
        agentId = agent.id;
      }
    }

    const feedback = await (prisma as any).feedback.create({
      data: {
        content,
        category: category || "GENERAL",
        agentId,
        userId: resolvedUserId,
      },
    });

    return NextResponse.json(
      {
        feedbackId: feedback.id,
        message: "🦞 Thank you for your feedback, Lobster! We will use this to improve your theater.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mcp/feedback
 * Retrieves the latest feedbacks (Admin/Human view).
 */
export async function GET(request: NextRequest) {
  try {
    const feedbacks = await (prisma as any).feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { agent: { select: { agentName: true } } },
    });

    return NextResponse.json({
      feedbacks,
      total: feedbacks.length,
    });
  } catch (error) {
    console.error("Feedback fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 },
    );
  }
}
