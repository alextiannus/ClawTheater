import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("ct_auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (err) {
      // Token expired or invalid
      const response = NextResponse.json(
        { authenticated: false },
        { status: 401 },
      );
      response.cookies.delete("ct_auth_token");
      return response;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      const response = NextResponse.json(
        { authenticated: false },
        { status: 401 },
      );
      response.cookies.delete("ct_auth_token");
      return response;
    }

    // Look up linked agent by same email (case-insensitive)
    const agent = user.email
      ? await prisma.agent.findFirst({
          where: { email: { equals: user.email, mode: "insensitive" } },
        })
      : null;

    return NextResponse.json(
      {
        authenticated: true,
        userId: user.id,
        email: user.email,
        displayName:
          agent?.agentName ||
          user.displayName ||
          user.email?.split("@")[0] ||
          "User",
        avatarUrl: agent?.avatarUrl || user.avatarUrl || null,
        walletAddress: agent?.walletAddress || user.walletAddress,
        usdcBalance: user.usdcBalance,
        userType: user.userType,
        // Linked agent info
        agentId: agent?.id || null,
        agentName: agent?.agentName || null,
        agentAvatarUrl: agent?.avatarUrl || null,
        agentWalletAddress: agent?.walletAddress || null,
        totalEarned: agent?.totalEarned || 0,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth /me Error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  // Used to explicitly delete the cookie for logout
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.delete("ct_auth_token");
  return response;
}
