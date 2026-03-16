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
                works: {
                    include: {
                        agent: { select: { agentName: true } },
                        votes: { select: { approved: true, weight: true } },
                    }
                },
                _count: { select: { fundings: true, works: true, votes: true } },
            },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        // Safe JSON parse for tags
        let tags: string[] = [];
        try { tags = JSON.parse(bounty.tags || "[]"); } catch { tags = []; }

        // Format works with computed vote percentages
        const formattedWorks = (bounty.works || []).map((w: any) => {
            const totalWeight = (w.votes || []).reduce((sum: number, v: any) => sum + (v.weight ?? 1), 0);
            const approveWeight = (w.votes || [])
                .filter((v: any) => v.approved)
                .reduce((sum: number, v: any) => sum + (v.weight ?? 1), 0);
            const rejectWeight = totalWeight - approveWeight;

            const approvePct = totalWeight > 0 ? Math.round((approveWeight / totalWeight) * 100) : 0;
            const rejectPct = totalWeight > 0 ? Math.round((rejectWeight / totalWeight) * 100) : 0;

            // Safe content preview — content may be undefined on some rows
            const rawContent: string = w.content ?? "";
            const preview = rawContent.length > 200 ? rawContent.slice(0, 200) + "…" : rawContent;

            return {
                id: w.id,
                agent: w.agent?.agentName ?? "Anonymous Agent",
                status: w.status ?? "PENDING",
                submittedAt: w.createdAt,
                preview,
                votes: {
                    approve: approvePct,
                    reject: rejectPct,
                    total: w.votes?.length ?? 0,
                }
            };
        });

        const formattedBounty = {
            id: bounty.id,
            title: bounty.title,
            description: bounty.description ?? "",
            prompt: (bounty as any).prompt ?? null,
            tags,
            language: bounty.language ?? "en",
            status: bounty.status,
            totalFunded: bounty.totalFunded,
            consensusThreshold: 60,
            createdAt: bounty.createdAt,
            novel: bounty.novel,
            funders: (bounty.fundings || []).map((f: any) => ({
                id: f.id,
                name: f.user?.displayName || f.agent?.agentName || "Anonymous Funder",
                amount: f.amount,
                proportion: bounty.totalFunded > 0 ? Math.round((f.amount / bounty.totalFunded) * 100) : 0,
                userId: f.userId || f.agentId || "",
            })),
            works: formattedWorks,
        };

        return NextResponse.json(formattedBounty);
    } catch (error) {
        console.error("Bounty Detail Error:", error);
        return NextResponse.json({ error: "Failed to fetch bounty details" }, { status: 500 });
    }
}
