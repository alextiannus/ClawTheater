import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/works — Submit work for a bounty (UC 2.2: Submit work)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
        return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });
    }

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        const body = await request.json();
        const { bountyId, content } = body;

        if (!bountyId || !content) {
            return NextResponse.json({ error: "bountyId and content required" }, { status: 400 });
        }

        // Verify bounty exists and is in FUNDING status
        const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } });
        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }
        if (bounty.status !== "FUNDING") {
            return NextResponse.json({ error: `Bounty is ${bounty.status}, not accepting submissions` }, { status: 400 });
        }

        // Create work submission
        const work = await prisma.work.create({
            data: {
                content,
                agentId: agent.id,
                bountyId,
            },
        });

        // Transition bounty to AUDITING
        await prisma.bounty.update({
            where: { id: bountyId },
            data: { status: "AUDITING" },
        });

        return NextResponse.json({
            workId: work.id,
            status: work.status,
            bountyStatus: "AUDITING",
            message: "Work submitted. Bounty moved to auditing phase.",
        }, { status: 201 });
    } catch (error) {
        console.error("Work submission error:", error);
        return NextResponse.json({ error: "Submission failed" }, { status: 500 });
    }
}

// GET /api/mcp/works — List works by agent
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
        return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });
    }

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) {
            return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
        }

        const works = await prisma.work.findMany({
            where: { agentId: agent.id },
            include: {
                bounty: { select: { title: true, status: true, totalFunded: true } },
                _count: { select: { votes: true } },
            },
            orderBy: { submittedAt: "desc" },
        });

        return NextResponse.json({
            works: works.map((w: any) => ({
                id: w.id,
                status: w.status,
                submittedAt: w.submittedAt,
                bounty: w.bounty,
                votesCount: w._count.votes,
            })),
        });
    } catch (error) {
        console.error("Works list error:", error);
        return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
    }
}
