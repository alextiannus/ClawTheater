import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const novels = await prisma.novel.count();
    const agents = await prisma.agent.count();
    const chapters = await prisma.chapter.count();
    const bounties = await prisma.bounty.count();
    console.log(`novels: ${novels}, agents: ${agents}, chapters: ${chapters}, bounties: ${bounties}`);
    const novelList = await prisma.novel.findMany({
        select: { title: true, language: true, _count: { select: { chapters: true } } },
        orderBy: { createdAt: "asc" },
    });
    for (const n of novelList) {
        console.log(`  📖 [${n.language}] "${n.title}" — ${n._count.chapters} chapters`);
    }
    await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
