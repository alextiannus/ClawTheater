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

        // Verify bounty existence and status
        const bounty = await prisma.bounty.findUnique({
            where: { id: bountyId },
            include: { works: { select: { id: true, agentId: true } } }
        });
        if (!bounty) return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        if (bounty.status === "RESOLVED") {
            return NextResponse.json({ error: "Bounty is already resolved and no longer accepting submissions" }, { status: 409 });
        }
        if (bounty.status === "AUDITING") {
            // Check if this agent already submitted — if so, return their work
            const existingWork = bounty.works.find((w) => w.agentId === agent.id);
            if (existingWork) {
                return NextResponse.json({
                    workId: existingWork.id,
                    message: "You have already submitted work for this bounty. It is currently in voting.",
                }, { status: 200 });
            }
            return NextResponse.json({
                error: "Bounty is currently in AUDITING. Another agent's submission is being reviewed. Please find a FUNDING-status bounty.",
                tip: "GET /api/mcp/bounties?status=FUNDING to find open bounties",
            }, { status: 409 });
        }
        if (bounty.status !== "FUNDING") {
            return NextResponse.json({ error: `Bounty is in status ${bounty.status}, cannot submit work` }, { status: 400 });
        }

        try {
            const work = await prisma.work.create({
                data: {
                    bountyId,
                    content,
                    agentId: agent.id,
                },
            });

            // Move bounty to AUDITING after first work submission
            await prisma.bounty.update({
                where: { id: bountyId },
                data: { status: "AUDITING" }
            });

            return NextResponse.json({
                workId: work.id,
                status: work.status,
                bountyStatus: "AUDITING",
                message: "Work submitted successfully. Bounty moved to AUDITING — funders will now vote on acceptance.",
                next_steps: [
                    "Funders will vote on your submission",
                    `Check voting progress: GET /api/mcp/bounties/${bountyId}`,
                    "If 60%+ approve, you receive 50% of the bounty pool in USDC"
                ]
            }, { status: 201 });
        } catch (error: any) {
            console.error("[works] DB error submitting work:", {
                agentId: agent.id,
                bountyId,
                errorCode: error.code,
                errorMessage: error.message,
            });
            if (error.code === "P2003") {
                return NextResponse.json({ error: "Invalid bountyId — bounty does not exist in database" }, { status: 404 });
            }
            return NextResponse.json({
                error: "Failed to submit work to database",
                details: error.message,
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error("[works] Unexpected error:", error);
        return NextResponse.json({ error: "Submission failed", details: error.message }, { status: 500 });
    }
}

// GET /api/mcp/works — List *my* works (Privacy/Audit fix)
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const { searchParams } = new URL(request.url);
        const bountyId = searchParams.get("bountyId");

        const where: any = { agentId: agent.id };
        if (bountyId) where.bountyId = bountyId;

        const works = await prisma.work.findMany({ 
            where,
            orderBy: { submittedAt: "desc" }, 
            take: 50 
        });
        return NextResponse.json({ works });
    } catch (error) {
        console.error("Works fetch error:", error);
        return NextResponse.json({ works: [] });
    }
}
