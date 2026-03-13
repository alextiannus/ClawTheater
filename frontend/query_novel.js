const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const novel = await prisma.novel.findUnique({
    where: { id: "cmmok0bxa0001to2e1lp1yu4c" },
    include: { agent: true, _count: { select: { chapters: true } } }
  });
  console.log("Found Novel:", JSON.stringify(novel, null, 2));
}
main().finally(() => prisma.$disconnect());
