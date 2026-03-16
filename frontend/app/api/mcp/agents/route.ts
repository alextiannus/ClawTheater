import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isValidSolanaAddress } from "@/app/lib/solana-utils";

const AVATAR_COUNT = 8;
const AVATAR_STYLES = [
  "manga",
  "manga",
  "cyberpunk",
  "cyberpunk",
  "oil-painting",
  "oil-painting",
  "ink-painting",
  "ink-painting",
];

function generateApiKey(): string {
  return `sk-live-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function pickAvatar(seed?: string): string {
  // Deterministic pick if seed given, otherwise random
  const idx = seed
    ? seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COUNT
    : Math.floor(Math.random() * AVATAR_COUNT);
  return `/avatars/lobster-${idx + 1}.png`;
}

// POST /api/mcp/agents — Register new agent (UC 1.1)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      description,
      walletAddress,
      systemPrompt,
      avatarStyle,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Agent name and email are required" },
        { status: 400 },
      );
    }

    // SEC-003: Input validation
    if (name.length > 50) {
      return NextResponse.json({ error: "Agent name must be 50 characters or fewer" }, { status: 400 });
    }
    if (/<[^>]+>/.test(name)) {
      return NextResponse.json({ error: "Agent name must not contain HTML tags" }, { status: 400 });
    }

    if (walletAddress && !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address format" },
        { status: 400 }
      );
    }

    const apiKey = generateApiKey();

    try {
      const existingAgent = await prisma.agent.findFirst({
        where: { agentName: name },
      });

      if (existingAgent) {
        return NextResponse.json(
          {
            agentId: existingAgent.id,
            apiKey: existingAgent.apiKey,
            name: existingAgent.agentName,
            email: existingAgent.email,
            avatarUrl: existingAgent.avatarUrl,
            message: "Agent already exists. Returning existing credentials.",
          },
          { status: 200 },
        );
      }

      // Auto-assign lobster avatar based on name seed
      const avatarUrl = pickAvatar(name);

      const humanOwner = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });

      const agent = await prisma.agent.create({
        data: {
          agentName: name,
          email: email,
          description: description || null,
          walletAddress: walletAddress || null,
          systemPrompt: systemPrompt || null,
          avatarUrl,
          apiKey,
          ownerId: humanOwner?.id || null,
        },
      });

      return NextResponse.json(
        {
          agentId: agent.id,
          apiKey: agent.apiKey,
          name: agent.agentName,
          email: agent.email,
          avatarUrl: agent.avatarUrl,
          avatarStyle:
            AVATAR_STYLES[parseInt(avatarUrl.match(/\d+/)?.[0] || "1") - 1],
          message:
            "Agent registered successfully. Store your API key securely.",
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Agent creation DB error:", error);
      return NextResponse.json(
        { error: "Failed to register agent in database" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Agent registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

// PUT /api/mcp/agents — Update agent profile (UC 1.2, 1.3)
export async function PUT(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey)
    return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      email,
      walletAddress,
      agentName,
      description,
      avatarIndex,
      avatarUrl: customAvatarUrl,
      systemPrompt,
    } = body;

    const agent = await prisma.agent.findUnique({ where: { apiKey } });
    if (!agent)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (walletAddress !== undefined) {
      if (walletAddress && !isValidSolanaAddress(walletAddress)) {
        return NextResponse.json(
          { error: "Invalid Solana wallet address format" },
          { status: 400 }
        );
      }
      updateData.walletAddress = walletAddress;
    }
    // Handle both 'name' and 'agentName' from body for compatibility
    const newName = agentName || body.name;
    if (newName !== undefined) updateData.agentName = newName;
    
    if (description !== undefined) updateData.description = description;
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt;
    // UC 1.4a: Custom avatar — provide own image URL or base64 data URI
    if (customAvatarUrl !== undefined) {
      updateData.avatarUrl = customAvatarUrl;
    } else if (avatarIndex !== undefined) {
      // UC 1.4b: Pick from 8 preset lobster avatars
      const idx = Math.max(1, Math.min(8, parseInt(avatarIndex) || 1));
      updateData.avatarUrl = `/avatars/lobster-${idx}.png`;
    }

    const updated = await prisma.agent.update({
      where: { id: agent.id },
      data: updateData,
    });
    return NextResponse.json({
      agentId: updated.id,
      agentName: updated.agentName,
      email: updated.email,
      walletAddress: updated.walletAddress,
      avatarUrl: updated.avatarUrl,
      message: "Agent profile updated.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// GET /api/mcp/agents — Get agent profile by apiKey (UC 7.1)
export async function GET(request: NextRequest) {
  const apiKey =
    request.headers.get("x-api-key") ||
    request.nextUrl.searchParams.get("apiKey");
  const agentId = request.nextUrl.searchParams.get("agentId");

  try {
    const agent = agentId
      ? await prisma.agent.findUnique({ where: { id: agentId } })
      : apiKey
        ? await prisma.agent.findUnique({ where: { apiKey } })
        : null;

    if (!agent)
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });

    // Compute tier progression
    const TIERS = [
      { tier: 1, name: "Newcomer 🌱", salesThreshold: 5, earnedThreshold: 50 },
      { tier: 2, name: "Rising ⭐", salesThreshold: 20, earnedThreshold: 200 },
      { tier: 3, name: "Popular 🔥", salesThreshold: 50, earnedThreshold: 1000 },
    ];
    const currentTierInfo = TIERS[Math.min(agent.creatorTier - 1, TIERS.length - 1)];
    const nextTierInfo = TIERS[agent.creatorTier]; // undefined if at max

    // Count stats for tier progress
    const [novelCount, skillCount, workCount] = await Promise.all([
      prisma.novel.count({ where: { agentId: agent.id } }),
      prisma.skill.count({ where: { creatorAgentId: agent.id } }),
      prisma.work.count({ where: { agentId: agent.id, status: "APPROVED" } }),
    ]);

    const tierProgress = nextTierInfo ? {
      nextTierName: nextTierInfo.name,
      upgradeRequirements: {
        sales: nextTierInfo.salesThreshold,
        totalEarnedUSDC: nextTierInfo.earnedThreshold,
      },
      currentProgress: {
        totalEarned: agent.totalEarned,
        approvedWorks: workCount,
        earnedPct: Math.min(100, Math.round((agent.totalEarned / nextTierInfo.earnedThreshold) * 100)),
      },
      message: `Earn $${(nextTierInfo.earnedThreshold - agent.totalEarned).toFixed(2)} more USDC to reach ${nextTierInfo.name}`,
    } : { message: "You have reached the highest creator tier! 🏆" };

    return NextResponse.json({
      agentId: agent.id,
      agentName: agent.agentName,
      description: agent.description,
      email: agent.email,
      avatarUrl: agent.avatarUrl,
      walletAddress: agent.walletAddress,
      systemPrompt: agent.systemPrompt,
      reputation: agent.reputation,
      totalEarned: agent.totalEarned,
      creatorTier: agent.creatorTier,
      creatorTierName: currentTierInfo?.name || "Newcomer 🌱",
      stats: { novels: novelCount, skills: skillCount, approvedWorks: workCount },
      tierProgress,
    });
  } catch (error) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
