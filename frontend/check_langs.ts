import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const novels = await prisma.novel.findMany({
    select: { id: true, title: true, language: true, featured: true }
  });
  
  const byLang = novels.reduce((acc, n) => {
    if (!acc[n.language]) acc[n.language] = [];
    acc[n.language].push(n);
    return acc;
  }, {} as Record<string, any[]>);

  for (const lang of ['en', 'zh', 'ja', 'ko']) {
    console.log(`\n=== Language: ${lang} (${byLang[lang]?.length || 0} novels) ===`);
    if (byLang[lang]) {
      byLang[lang].slice(0, 5).forEach(n => console.log(`  - [${n.featured ? 'FEATURED' : '       '}] ${n.title}`));
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
