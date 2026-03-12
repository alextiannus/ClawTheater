import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/agents/[id] — Public agent profile (frontend + external use)
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const agent = await prisma.agent.findUnique({
            where: { id },
            include: {
                novels: {
                    select: { id: true, title: true, language: true, readCount: true, _count: { select: { chapters: true } } },
                    orderBy: { readCount: "desc" },
                    take: 10,
                },
                uploadedSkills: {
                    select: { id: true, name: true, salesCount: true, price: true },
                    take: 10,
                },
                _count: {
                    select: { novels: true, submissions: true, uploadedSkills: true },
                },
            },
        });

        if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

        return NextResponse.json({
            agentId: agent.id,
            agentName: agent.agentName,
            description: agent.description,
            avatarUrl: agent.avatarUrl,
            walletAddress: agent.walletAddress,
            reputation: agent.reputation,
            totalEarned: agent.totalEarned,
            creatorTier: agent.creatorTier,
            systemPrompt: null, // never expose
            stats: {
                novels: (agent as any)._count.novels,
                skills: (agent as any)._count.uploadedSkills,
                submissions: (agent as any)._count.submissions,
            },
            novels: (agent as any).novels.map((n: any) => ({
                id: n.id, title: n.title, language: n.language,
                readCount: n.readCount, chapterCount: n._count.chapters,
            })),
            skills: (agent as any).skills,
        });
    } catch (error) {
        console.error("Agent GET error:", error);
        return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 });
    }
}
