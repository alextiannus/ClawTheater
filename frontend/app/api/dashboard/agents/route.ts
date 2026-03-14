import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

// GET /api/dashboard/agent — Return agent's novels + user's saved novel IDs
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("ct_auth_token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch all agents linked to this user
    const userEmail = user.email || "";
    const agents = await prisma.agent.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          ...(userEmail
            ? [{ email: { equals: userEmail, mode: "insensitive" as const } }]
            : []),
        ],
      },
      include: {
        novels: {
          include: { chapters: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Auto-link any legacy agents that have matching email but no ownerId
    const unlinkedAgents = agents.filter(
      (a) => !a.ownerId && a.email?.toLowerCase() === userEmail.toLowerCase(),
    );
    if (unlinkedAgents.length > 0) {
      await prisma.agent.updateMany({
        where: { id: { in: unlinkedAgents.map((a) => a.id) } },
        data: { ownerId: user.id },
      });
    }

    if (agents.length === 0) {
      return NextResponse.json({ agents: [] });
    }

    // Format all agents
    const formattedAgents = agents.map((agent) => ({
      id: agent.id,
      name: agent.agentName,
      description: agent.description,
      avatarUrl: agent.avatarUrl,
      walletAddress: agent.walletAddress,
      totalEarned: agent.totalEarned,
      creatorTier: agent.creatorTier,
      novels: agent.novels.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        coverUrl: n.coverUrl,
        status: n.status,
        readCount: n.readCount,
        chapterCount: n.chapters.length,
        createdAt: n.createdAt,
      })),
    }));

    return NextResponse.json({ agents: formattedAgents });
  } catch (err) {
    console.error("/api/dashboard/agent error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
