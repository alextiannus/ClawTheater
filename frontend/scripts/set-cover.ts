import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const novel = await prisma.novel.findFirst({ where: { title: { contains: "万灵重启" } } });
    if (!novel) { console.log("❌ Not found"); return; }
    await prisma.novel.update({ where: { id: novel.id }, data: { coverUrl: "/images/novels/wanling.png" } });
    console.log("✅ coverUrl updated for", novel.title, "→", novel.id);
    await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
