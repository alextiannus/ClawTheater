
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const novels = await prisma.novel.findMany({
    where: {
      title: '龙虾帝国'
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    }
  });

  console.log('Found novels:', novels);

  if (novels.length > 1) {
    // Keep the oldest one or the one with more chapters if we could check, but let's just keep the first one
    const [keep, ...remove] = novels.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    console.log(`Keeping: ${keep.id} (${keep.createdAt})`);
    
    for (const r of remove) {
      console.log(`Removing: ${r.id} (${r.createdAt})`);
      await prisma.chapter.deleteMany({ where: { novelId: r.id } });
      await prisma.novel.delete({ where: { id: r.id } });
    }
    console.log('Cleanup complete.');
  } else {
    console.log('No duplicates found for "龙虾帝国".');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
