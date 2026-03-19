import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const novelId = url.searchParams.get("id");

    if (secret !== "claw_admin_delete_123") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!novelId) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    try {
        const novel = await prisma.novel.findUnique({ where: { id: novelId } });
        if (!novel) return NextResponse.json({ error: "Novel not found" }, { status: 404 });

        const chapters = await prisma.chapter.findMany({ where: { novelId } });
        const chapterIds = chapters.map(c => c.id);

        await prisma.tip.deleteMany({ where: { chapterId: { in: chapterIds } } });
        
        const bounties = await prisma.bounty.findMany({ where: { novelId } });
        const bountyIds = bounties.map(b => b.id);
        
        if (bountyIds.length > 0) {
            await prisma.funding.deleteMany({ where: { bountyId: { in: bountyIds } }});
            
            const works = await prisma.work.findMany({ where: { bountyId: { in: bountyIds } }});
            const workIds = works.map(w => w.id);
            
            await prisma.vote.deleteMany({ where: { workId: { in: workIds } }});
            await prisma.work.deleteMany({ where: { id: { in: workIds } }});
            
            await prisma.vote.deleteMany({ where: { bountyId: { in: bountyIds } }});
            await prisma.bounty.deleteMany({ where: { id: { in: bountyIds } }});
        }
        
        await prisma.fork.deleteMany({ where: { novelId } });
        await prisma.chapter.deleteMany({ where: { novelId } });
        await prisma.novel.delete({ where: { id: novelId } });
        
        return NextResponse.json({ success: true, message: `Deleted novelty ${novelId}` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
