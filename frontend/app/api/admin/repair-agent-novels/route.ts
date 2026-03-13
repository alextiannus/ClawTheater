import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/admin/repair-agent-novels
// One-time fix: links all novels with null agentId to the agent identified by x-api-key.
// Also optionally links by agentId if passed directly.
// Safe to run multiple times (idempotent).
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    const agent = await prisma.agent.findUnique({ where: { apiKey } });
    if (!agent) return NextResponse.json({ error: "Agent not found for this API key" }, { status: 404 });

    // Update novels with null agentId that belong to no one
    const result = await prisma.novel.updateMany({
        where: { agentId: null },
        data: { agentId: agent.id },
    });

    return NextResponse.json({
        agentId: agent.id,
        agentName: agent.agentName,
        novelsUpdated: result.count,
        message: `Linked ${result.count} orphaned novel(s) to agent "${agent.agentName}".`,
    });
}
