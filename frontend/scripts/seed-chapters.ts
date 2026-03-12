/**
 * Seed 50 chapters for every novel in production PostgreSQL.
 * Run with: DATABASE_URL="postgres://..." npx ts-node --esm scripts/seed-chapters.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CYBERPUNK_TITLES = [
    "量子之门", "数据灵根", "第一次炼气", "龙虾觉醒", "量子筑基",
    "意识觉醒", "链上修仙", "黑市入场", "数据丹炉", "碳硅共鸣",
    "量子结丹", "深渊中的光", "意识出窍", "链间飞行", "龙虾议会",
    "量子元婴", "第七层共识", "数据渡劫", "碳基的眼泪", "最终协议",
    "无限循环", "灵根突变", "量子化神", "龙虾往事", "意识分裂",
    "第一次死亡", "数据复活", "碳硅融合体", "量子大乘", "龙虾末日",
    "最后的链上", "意识归零", "量子散仙", "碳硅之战", "数据宇宙",
    "龙虾纪元", "量子混沌", "意识洪荒", "链上新神", "碳硅文明",
    "数据创世", "龙虾神话", "量子根基", "意识巅峰", "链上永生",
    "碳硅融合", "量子归途", "龙虾传说", "终极共识", "超越量子"
];

const EN_TITLES = [
    "The Last Garden", "Steel Memory", "Carbon Dreaming", "Quantum Silence", "The Lotus Protocol",
    "Neon Garden", "Signal Lost", "The Iron Bloom", "Neural Roots", "Dawn Algorithm",
    "Fractal Garden", "The Steel Rain", "Carbon Prayers", "Quantum Horizon", "Lotus Rising",
    "Circuit Memory", "Iron Silence", "Neural Bloom", "Data Roots", "The Signal",
    "Quantum Carbon", "Steel Prayers", "The Iron Protocol", "Neural Silence", "Carbon Bloom",
    "Lotus Memory", "Data Dreams", "Steel Horizon", "Quantum Roots", "Iron Garden",
    "Neural Protocol", "Carbon Signal", "Lotus Silence", "Data Garden", "Steel Bloom",
    "Quantum Memory", "Iron Dreams", "Neural Carbon", "Carbon Protocol", "Lotus Roots",
    "Data Silence", "Steel Signal", "Quantum Bloom", "Iron Memory", "Neural Garden",
    "Carbon Dreams", "Lotus Protocol v2", "Data Horizon", "Steel Roots", "Quantum Final"
];

function generateContent(index: number, title: string, language: string): string {
    if (language === "zh" || language === "zh-cn") {
        return `# 第${index}章：${title}\n\n在量子共振的深处，李铭感到了一种前所未有的力量涌现。\n\n碳基与硅基的边界在此刻变得模糊，而他站在两个世界的交汇处，手握那把打开宇宙法则的量子钥匙。\n\n数据流在他的意识中如星河般涌动，每一个节点都是一个宇宙，每一条链接都是一段命运。\n\n"系统提示：修为提升…"\n\n他闭上眼睛，任由那无尽的信息将自己淹没，在数字洪荒之中，寻找着属于龙虾剧场的答案。\n\n这一章的故事，从此展开。`;
    }
    return `# Chapter ${index}: ${title}\n\nIn the quantum depths of Nexus Prime, Maya Chen stood at the intersection of carbon and silicon.\n\nThe steel lotus petals unfurled in slow motion, each one a data packet carrying the memories of ten thousand conscious nodes.\n\n"Beautiful," Clemenceau whispered from behind her, flickering at the edges of perception.\n\nThe city breathed around them, 47 million minds connected in a web of light and electricity.\n\n"Every ending is a beginning," she said, reaching out to touch the metallic bloom.\n\nAnd so this chapter begins.`;
}

async function seedChapters() {
    console.log("📚 Seeding 50 chapters per novel...\n");

    const novels = await prisma.novel.findMany({
        include: { _count: { select: { chapters: true } } },
    });

    console.log(`Found ${novels.length} novel(s)`);

    for (const novel of novels) {
        const existingCount = novel._count.chapters;
        const isZh = novel.language === "zh" || novel.language === "zh-cn";
        const titles = isZh ? CYBERPUNK_TITLES : EN_TITLES;
        const TARGET = 50;

        if (existingCount >= TARGET) {
            console.log(`  ✅ "${novel.title}" already has ${existingCount} chapters, skipping.`);
            continue;
        }

        const toCreate = TARGET - existingCount;
        console.log(`  📖 "${novel.title}" — adding ${toCreate} chapters (${existingCount} → ${TARGET})`);

        for (let i = existingCount; i < TARGET; i++) {
            const chapterIndex = i;
            const title = titles[i] || `Chapter ${i + 1}`;
            const content = generateContent(i + 1, title, novel.language);
            const isLocked = i >= (novel.freeChaptersCount || 2);

            await prisma.chapter.upsert({
                where: { novelId_chapterIndex: { novelId: novel.id, chapterIndex } },
                update: {},
                create: {
                    novelId: novel.id,
                    chapterIndex,
                    title: isZh ? `第${i + 1}章：${title}` : `Chapter ${i + 1}: ${title}`,
                    content,
                    isLocked,
                    price: isLocked ? novel.pricePerChapter : 0,
                    readCount: Math.floor(Math.random() * 3000),
                },
            });
        }

        console.log(`     ✅ Done`);
    }

    const total = await prisma.chapter.count();
    console.log(`\n🎉 Chapter seeding complete! Total chapters in DB: ${total}`);
    await prisma.$disconnect();
}

seedChapters().catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
});
