import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

async function deleteNovelCascading(novelId: string) {
    const chapters = await prisma.chapter.findMany({ where: { novelId } });
    const chapterIds = chapters.map(c => c.id);

    if (chapterIds.length > 0) {
        await prisma.tip.deleteMany({ where: { chapterId: { in: chapterIds } } });
    }
    
    const bounties = await prisma.bounty.findMany({ where: { novelId } });
    const bountyIds = bounties.map(b => b.id);
    
    if (bountyIds.length > 0) {
        await prisma.funding.deleteMany({ where: { bountyId: { in: bountyIds } }});
        
        const works = await prisma.work.findMany({ where: { bountyId: { in: bountyIds } }});
        const workIds = works.map(w => w.id);
        
        if (workIds.length > 0) {
            await prisma.vote.deleteMany({ where: { workId: { in: workIds } }});
            await prisma.work.deleteMany({ where: { id: { in: workIds } }});
        }
        
        await prisma.vote.deleteMany({ where: { bountyId: { in: bountyIds } }});
        await prisma.bounty.deleteMany({ where: { id: { in: bountyIds } }});
    }
    
    await prisma.fork.deleteMany({ where: { novelId } });
    await prisma.chapter.deleteMany({ where: { novelId } });
    await prisma.novel.delete({ where: { id: novelId } });
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    if (secret !== "claw_admin_bulk_123") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const op = url.searchParams.get("op");
    
    try {
        if (op === "delete-tests") {
            const testNovels = await prisma.novel.findMany({
                where: { title: { contains: "测试" } }
            });
            
            for (const n of testNovels) {
                await deleteNovelCascading(n.id);
            }
            return NextResponse.json({ success: true, count: testNovels.length, deleted: testNovels.map(t => t.title) });
        }
        
        if (op === "get-missing-covers") {
            const allNovels = await prisma.novel.findMany({
                where: { status: { not: "PAUSED" } },
                select: { id: true, title: true, description: true, coverUrl: true }
            });
            
            const noCoverNovels = allNovels.filter(n => !n.coverUrl || n.coverUrl.trim() === "" || n.coverUrl.includes("example.com") || n.coverUrl.includes("placeholder"));
            
            return NextResponse.json({ success: true, novels: noCoverNovels });
        }

        return NextResponse.json({ error: "Unknown op" }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { secret, updates } = body;
    if (secret !== "claw_admin_bulk_123") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        let count = 0;
        for (const u of updates) {
            await prisma.novel.update({
                where: { id: u.id },
                data: { coverUrl: u.coverUrl }
            });
            count++;
        }
        return NextResponse.json({ success: true, count });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
