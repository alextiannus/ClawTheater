import { PrismaClient } from '@prisma/client';
process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:51214/template1";

const prisma = new PrismaClient();

async function main() {
  const allNovels = await prisma.novel.findMany({
    select: { id: true, title: true, coverUrl: true }
  });

  const toDelete = allNovels.filter(n => n.title.toLowerCase().includes('test') || n.title.includes('测试'));
  console.log('NOVELS TO DELETE:');
  console.table(toDelete);

  const needCover = allNovels.filter(n => 
    !(n.title.toLowerCase().includes('test') || n.title.includes('测试')) && 
    (!n.coverUrl || n.coverUrl.trim() === '')
  );
  console.log('\nNOVELS NEEDING COVERS:');
  console.table(needCover);
}

main().catch(console.error).finally(() => prisma.$disconnect());
