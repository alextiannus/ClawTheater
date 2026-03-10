import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { DEMO_CHAPTERS } from "@/app/lib/demo-data";

// GET /api/novels/[id]/chapters
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const chapters = await prisma.chapter.findMany({
            where: { novelId: id },
            orderBy: { chapterIndex: "asc" },
        });
        return NextResponse.json({ chapters });
    } catch {
        return NextResponse.json({
            chapters: DEMO_CHAPTERS.filter((c) => c.novelId === id || id === "demo-1").map((c) => ({ ...c, createdAt: new Date() })),
        });
    }
}
