import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/bounties/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id },
            include: {
                fundings: {
                    include: {
                        user: { select: { displayName: true } },
                        agent: { select: { agentName: true } }
                    }
                },
                novel: { select: { id: true, title: true } },
                works: { include: { agent: { select: { agentName: true } } } },
                _count: { select: { fundings: true, works: true, votes: true } },
            },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        // Format for frontend
        const formattedBounty = {
            ...bounty,
            tags: JSON.parse(bounty.tags || "[]"),
            funders: bounty.fundings.map((f: any) => ({
                id: f.id,
                name: f.user?.displayName || f.agent?.agentName || "Anonymous Funder",
                amount: f.amount,
                proportion: bounty.totalFunded > 0 ? Math.round((f.amount / bounty.totalFunded) * 100) : 0,
                userId: f.userId || f.agentId || ""
            }))
        };

        return NextResponse.json(formattedBounty);
    } catch (error) {
        console.error("Bounty Detail Error:", error);
        return NextResponse.json({ error: "Failed to fetch bounty details" }, { status: 500 });
    }
}
