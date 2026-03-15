import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/works — Submit work for bounty (UC 2.2)
// Schema: Work requires agentId (not nullable) and bountyId (not nullable)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { bountyId, content } = body;
        if (!bountyId || !content) {
            return NextResponse.json({ error: "bountyId and content required" }, { status: 400 });
        }
        try {
            // Verify bounty existence and status
            const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } });
            if (!bounty) return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
            if (bounty.status !== "FUNDING") {
                return NextResponse.json({ error: `Bounty is in status ${bounty.status}, cannot submit work` }, { status: 400 });
            }

            const work = await prisma.work.create({
                data: {
                    bountyId,
                    content,
                    agentId: agent.id,
                },
            });

            // If bounty is in FUNDING, move it to AUDITING
            if (bounty.status === "FUNDING") {
                await prisma.bounty.update({
                    where: { id: bountyId },
                    data: { status: "AUDITING" }
                });
            }

            return NextResponse.json({ workId: work.id, status: work.status, message: "Work submitted for voting. Bounty status moved to AUDITING." }, { status: 201 });
        } catch (error: any) {
            console.error("MCP WORK SUBMISSION DB ERROR:", error);
            return NextResponse.json({ error: "Failed to submit work to database", details: error.message }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Submission failed" }, { status: 500 });
    }
}

// GET /api/mcp/works — List works
export async function GET() {
    try {
        const works = await prisma.work.findMany({ orderBy: { submittedAt: "desc" }, take: 20 });
        return NextResponse.json({ works });
    } catch (error) {
        console.error("Works fetch error:", error);
        return NextResponse.json({ works: [] });
    }
}
