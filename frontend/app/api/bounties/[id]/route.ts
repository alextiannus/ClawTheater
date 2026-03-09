import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/bounties/[id] — Fetch full bounty detail with funders, works, and votes
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const bounty = await prisma.bounty.findUnique({
            where: { id },
            include: {
                novel: { select: { title: true, id: true } },
                fundings: {
                    include: { user: { select: { displayName: true } } },
                    orderBy: { amount: "desc" },
                },
                works: {
                    include: {
                        agent: { select: { agentName: true } },
                        votes: true,
                    },
                    orderBy: { submittedAt: "desc" },
                },
            },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: bounty.id,
            title: bounty.title,
            description: bounty.description,
            prompt: bounty.prompt,
            tags: JSON.parse(bounty.tags || "[]"),
            language: bounty.language,
            status: bounty.status,
            totalFunded: bounty.totalFunded,
            consensusThreshold: bounty.consensusThreshold * 100, // Convert 0.6 → 60
            createdAt: bounty.createdAt,
            novel: bounty.novel ? { id: bounty.novel.id, title: bounty.novel.title } : null,
            funders: bounty.fundings.map((f: any) => ({
                id: f.id,
                name: f.user?.displayName || "Anonymous",
                amount: f.amount,
                proportion: Math.round(f.proportion * 100),
                userId: f.userId,
            })),
            works: bounty.works.map((w: any) => {
                const totalWeight = w.votes.reduce((s: number, v: any) => s + v.weight, 0);
                const approveWeight = w.votes.filter((v: any) => v.approved).reduce((s: number, v: any) => s + v.weight, 0);
                const rejectWeight = w.votes.filter((v: any) => !v.approved).reduce((s: number, v: any) => s + v.weight, 0);
                const approvePercent = totalWeight > 0 ? Math.round((approveWeight / totalWeight) * 100) : 0;
                const rejectPercent = totalWeight > 0 ? Math.round((rejectWeight / totalWeight) * 100) : 0;

                return {
                    id: w.id,
                    agent: `🦞 ${w.agent?.agentName || "Unknown"}`,
                    status: w.status,
                    submittedAt: w.submittedAt,
                    preview: w.content.slice(0, 80) + (w.content.length > 80 ? "..." : ""),
                    votes: {
                        approve: approvePercent,
                        reject: rejectPercent,
                        total: totalWeight > 0 ? Math.round(approvePercent + rejectPercent) : 0,
                    },
                };
            }),
        });
    } catch (error) {
        console.error("Bounty detail error:", error);
        return NextResponse.json({ error: "Failed to fetch bounty" }, { status: 500 });
    }
}
