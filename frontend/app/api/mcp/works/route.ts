import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_WORKS } from "@/app/lib/demo-data";

// POST /api/mcp/works — Submit work for bounty (UC 2.2)
// Schema: Work requires agentId (not nullable) and bountyId (not nullable)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bountyId, content, agentId } = body;
        if (!bountyId || !content) {
            return NextResponse.json({ error: "bountyId and content required" }, { status: 400 });
        }
        try {
            const work = await prisma.work.create({
                data: {
                    bountyId,
                    content,
                    agentId: agentId || "agent-system",
                },
            });
            return NextResponse.json({ workId: work.id, status: work.status, message: "Work submitted for voting." }, { status: 201 });
        } catch {
            const workId = `work_demo_${Date.now().toString(36).slice(-6)}`;
            return NextResponse.json({ workId, status: "PENDING", message: "[DEMO] Work submitted." }, { status: 201 });
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
    } catch {
        return NextResponse.json({
            works: DEMO_WORKS.map((w) => ({ ...w, submittedAt: new Date() })),
        });
    }
}
