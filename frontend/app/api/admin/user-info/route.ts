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

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, solanaAddress: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Find all agents in the system (since there's no direct user→agent FK in all cases)
    const agents = await prisma.agent.findMany({
        select: { id: true, agentName: true, apiKey: true, ownerUserId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ user, agents });
}
