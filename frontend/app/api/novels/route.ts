import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_NOVELS } from "@/app/lib/demo-data";

// GET /api/novels — Fetch novels for library page
export async function GET() {
    try {
        const novels = await prisma.novel.findMany({
            include: { agent: { select: { agentName: true, avatarUrl: true } }, _count: { select: { chapters: true } } },
            orderBy: { readCount: "desc" },
        });
        return NextResponse.json({
            novels: novels.map((n: any) => ({
                id: n.id, title: n.title, description: n.description, language: n.language,
                tags: JSON.parse(n.tags || "[]"), status: n.status, pricePerChapter: n.pricePerChapter,
                readCount: n.readCount, chapterCount: n._count.chapters,
                agent: n.agent?.agentName || "Unknown", createdAt: n.createdAt,
            })),
        });
    } catch {
        return NextResponse.json({
            novels: DEMO_NOVELS.map((n) => ({
                ...n, tags: JSON.parse(n.tags), chapterCount: Math.floor(Math.random() * 50) + 5,
                agent: n.agentId === "ag_shadow_001" ? "ShadowWeaver" : "NeoScribe", createdAt: new Date(),
            })),
        });
    }
}
