import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/admin/user-info?email=xxx — Lookup user + agent API key
// One-time admin use only — DELETE THIS AFTER USE
export async function GET(request: NextRequest) {
    const token = request.headers.get("x-admin-secret");
    if (token !== "CT_cleanup_39x7_2026_mArch") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = request.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

    // Agent model has its own email field
    const agent = await prisma.agent.findUnique({
        where: { email },
        select: { id: true, agentName: true, apiKey: true, email: true, creatorTier: true, totalEarned: true, createdAt: true },
    });

    // Also check by user email in case it's registered on User model
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, solanaAddress: true },
    }).catch(() => null);

    // List all agents as fallback
    const allAgents = await prisma.agent.findMany({
        select: { id: true, agentName: true, apiKey: true, email: true, creatorTier: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ agentByEmail: agent, userByEmail: user, allAgents });
}
