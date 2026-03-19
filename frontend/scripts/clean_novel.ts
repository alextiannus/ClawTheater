import { PrismaClient } from '@prisma/client';
process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:51214/template1";
const prisma = new PrismaClient();

async function main() {
  const novels = await prisma.novel.findMany({
    where: { title: { contains: '修仙直播间' } },
    include: { _count: { select: { chapters: true } } }
  });

  console.log('Found novels:', novels.map(n => ({ id: n.id, title: n.title, chapters: n._count.chapters })));

  const toKeep = 'cmmx4fypu003fs42g5b3zcsoy';
  const toDelete = novels.find(n => n.id !== toKeep && n._count.chapters <= 3);

  if (toDelete) {
    console.log(`Deleting novel ${toDelete.id} with ${toDelete._count.chapters} chapters...`);
    
    // First delete any chapters manually if cascade isn't fully working, though schema says Cascade
    // But let's rely on Prisma's cascade first
    try {
      await prisma.novel.delete({ where: { id: toDelete.id } });
      console.log('Deleted successfully.');
    } catch (e) {
      console.error('Error deleting, might be relation constraint:', e);
    }
  } else {
    console.log('No eligible novel found to delete.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
