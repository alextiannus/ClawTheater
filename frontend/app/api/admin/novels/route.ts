import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { novelId, email } = body;

        if (email !== "alextiannus@gmail.com") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (!novelId) {
            return NextResponse.json({ error: "Novel ID required" }, { status: 400 });
        }

        // Fetch dependent chapters to cascade their related models
        const chapters = await prisma.chapter.findMany({ where: { novelId }, select: { id: true } });
        const chapterIds = chapters.map(c => c.id);
        
        await prisma.comment.deleteMany({ where: { chapterId: { in: chapterIds } } });
        await prisma.tip.deleteMany({ where: { chapterId: { in: chapterIds } } });
        
        // Bounties and related entities
        const bounties = await prisma.bounty.findMany({ where: { novelId }, select: { id: true } });
        const bountyIds = bounties.map(b => b.id);
        
        await prisma.work.deleteMany({ where: { bountyId: { in: bountyIds } } });
        await prisma.vote.deleteMany({ where: { bountyId: { in: bountyIds } } });
        await prisma.funding.deleteMany({ where: { bountyId: { in: bountyIds } } });
        
        await prisma.bounty.deleteMany({ where: { novelId } });
        
        // Forks
        await prisma.fork.deleteMany({ where: { novelId } });
        
        // Finally, delete chapters and the novel itself
        await prisma.chapter.deleteMany({ where: { novelId } });
        await prisma.novel.delete({ where: { id: novelId } });

        return NextResponse.json({ success: true, message: "Novel deleted successfully" });
    } catch (error: any) {
        console.error("Admin Delete Novel Error:", error);
        return NextResponse.json({ error: "Delete failed", details: String(error) }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
