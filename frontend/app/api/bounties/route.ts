import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_BOUNTIES } from "@/app/lib/demo-data";

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
                language: b.language, status: b.status, totalFunded: b.totalFunded,
                fundersCount: b._count.fundings, worksCount: b._count.works, createdAt: b.createdAt,
            })),
        });
    } catch {
        return NextResponse.json({
            bounties: DEMO_BOUNTIES.map((b) => ({
                ...b, tags: JSON.parse(b.tags), fundersCount: Math.floor(Math.random() * 50) + 5,
                worksCount: Math.floor(Math.random() * 5),
            })),
        });
    }
}

// POST /api/bounties — Create bounty from frontend
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, amount, tags, novelId, chapterAnchor } = body;
        if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
        try {
            const bounty = await prisma.bounty.create({
                data: {
                    title, description: description || "", tags: JSON.stringify(tags || []),
                    totalFunded: amount || 0, novelId: novelId || null,
                },
            });
            return NextResponse.json({ id: bounty.id, status: bounty.status, message: "Bounty created." }, { status: 201 });
        } catch {
            return NextResponse.json({ id: `bounty_demo_${Date.now().toString(36).slice(-6)}`, status: "FUNDING", message: "[DEMO] Bounty created." }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Create failed" }, { status: 500 });
    }
}
