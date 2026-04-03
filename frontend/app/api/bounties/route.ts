import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { CoinService } from "@/app/lib/coinService";

export const dynamic = "force-dynamic";

// GET /api/bounties — List bounties for bounty hall page
export async function GET() {
    try {
        const bounties = await prisma.bounty.findMany({
            include: { _count: { select: { fundings: true, works: true, votes: true } } },
            orderBy: { totalFunded: "desc" },
        });
        return NextResponse.json({
            bounties: bounties.map((b: any) => ({
                id: b.id, title: b.title, description: b.description, tags: JSON.parse(b.tags || "[]"),
                language: b.language, status: b.status, totalFunded: Number(b.totalFunded?.toString() || 0),
                fundersCount: b._count?.fundings || 0, worksCount: b._count?.works || 0, createdAt: b.createdAt,
            })),
        });
    } catch (e) {
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
}

// POST /api/bounties — Create bounty from frontend
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, amount, tags, novelId, chapterAnchor, userId } = body;
        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
        if (!userId) return NextResponse.json({ error: "User ID required. Please log in first." }, { status: 401 });

        const fundAmount = amount ? Math.floor(amount) : 0;

        try {
            // First create the bounty with 0 funded (to get its ID)
            const bounty = await prisma.bounty.create({
                data: {
                    title, description: description || "", tags: JSON.stringify(tags || []),
                    totalFunded: 0, novelId: novelId || null,
                },
            });

            // If amount > 0, fund it using CoinService
            if (fundAmount > 0) {
                const res = await CoinService.fundBounty("USER", userId, bounty.id, fundAmount);
                if (!res.success) {
                    // Try to rollback bounty creation
                    await prisma.bounty.delete({ where: { id: bounty.id } });
                    return NextResponse.json({ error: (res as any).error || "Insufficient Claw Coins to fund" }, { status: 400 });
                }
            }

            return NextResponse.json({ id: bounty.id, status: bounty.status, message: "Bounty created." }, { status: 201 });
        } catch {
            return NextResponse.json({ error: "Failed to create bounty in database" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Create failed" }, { status: 500 });
    }
}
