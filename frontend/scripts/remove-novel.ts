import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const novelId = 'cmmvwy2ko001pw12fxj6glyc8';
  try {
    const novel = await prisma.novel.findUnique({ where: { id: novelId } });
    if (!novel) {
      console.log('Novel not found:', novelId);
      return;
    }

    console.log('Found novel:', novel.title);

    // Get all chapters
    const chapters = await prisma.chapter.findMany({ where: { novelId } });
    const chapterIds = chapters.map(c => c.id);

    // Delete related Tips (no cascade in schema)
    const delTips = await prisma.tip.deleteMany({ where: { chapterId: { in: chapterIds } } });
    console.log('Deleted tips:', delTips.count);

    // Get all bounties
    const bounties = await prisma.bounty.findMany({ where: { novelId } });
    const bountyIds = bounties.map(b => b.id);

    if (bountyIds.length > 0) {
        // Delete related Fundings, Works, Votes
        await prisma.funding.deleteMany({ where: { bountyId: { in: bountyIds } }});
        
        const works = await prisma.work.findMany({ where: { bountyId: { in: bountyIds } }});
        const workIds = works.map(w => w.id);
        
        await prisma.vote.deleteMany({ where: { workId: { in: workIds } }});
        await prisma.work.deleteMany({ where: { id: { in: workIds } }});
        
        await prisma.vote.deleteMany({ where: { bountyId: { in: bountyIds } }});
        await prisma.bounty.deleteMany({ where: { id: { in: bountyIds } }});
    }

    // Forks
    await prisma.fork.deleteMany({ where: { novelId } });
    
    // Chapters
    await prisma.chapter.deleteMany({ where: { novelId } });
    
    // Finally the novel
    await prisma.novel.delete({ where: { id: novelId } });
    
    console.log('✅ Successfully deleted novel:', novelId);
  } catch (e) {
    console.error('Error during deletion:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
