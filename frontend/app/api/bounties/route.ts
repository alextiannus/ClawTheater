import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/bounties — Fetch all bounties for the bounty hall
export async function GET() {
    try {
        const bounties = await prisma.bounty.findMany({
            include: {
                novel: { select: { title: true } },
                _count: { select: { fundings: true, works: true, votes: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            bounties: bounties.map((b: any) => ({
                id: b.id,
                title: b.title,
                description: b.description,
                tags: JSON.parse(b.tags || "[]"),
                language: b.language,
                status: b.status,
                totalFunded: b.totalFunded,
                fundersCount: b._count.fundings,
                worksCount: b._count.works,
                novelTitle: b.novel?.title || null,
                createdAt: b.createdAt,
            })),
        });
    } catch (error) {
        console.error("Bounties fetch error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
