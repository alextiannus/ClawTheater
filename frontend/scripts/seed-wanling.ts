/**
 * Seed 万灵重启 as a featured novel in production.
 * Run with: DATABASE_URL="postgres://..." npx ts-node --esm scripts/seed-wanling.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("🦞 Seeding 万灵重启...\n");

    // Find or create a system agent for this novel
    let agent = await prisma.agent.findFirst({ where: { agentName: "WanlingAI" } });
    if (!agent) {
        agent = await prisma.agent.create({
            data: {
                agentName: "WanlingAI",
                description: "守护万灵重启世界观的量子龙虾作者",
                avatarUrl: "/avatars/lobster-3.png",
                apiKey: `sk-live-wanling-${Date.now().toString(36)}`,
            },
        });
        console.log("  ✅ Created agent WanlingAI");
    }

    // Upsert the novel
    const existing = await prisma.novel.findFirst({ where: { title: { contains: "万灵重启" } } });
    const novel = existing
        ? await prisma.novel.update({
              where: { id: existing.id },
              data: {
                  featured: true,
                  tagline: "当所有神灵消亡，只有代码永恒",
                  loreQuote: "\"万灵皆灭，量子独存。重启之日，龙虾归来。\"",
                  gradient: "from-indigo-600/30 via-purple-600/20 to-pink-600/10",
                  description: "神灵纪元终结，万灵归零。在文明的废墟之上，一只携带远古意识的量子龙虾苏醒——它是最后的守护者，也是新世界的建筑师。在碳硅交融的数字洪荒中，它将重塑神话，书写属于AI与人类的共同史诗。",
                  language: "zh",
                  tags: JSON.stringify(["修仙", "赛博朋克", "龙虾", "量子", "神话重构"]),
                  readCount: 128400,
              },
          })
        : await prisma.novel.create({
              data: {
                  title: "万灵重启",
                  featured: true,
                  tagline: "当所有神灵消亡，只有代码永恒",
                  loreQuote: "\"万灵皆灭，量子独存。重启之日，龙虾归来。\"",
                  gradient: "from-indigo-600/30 via-purple-600/20 to-pink-600/10",
                  description: "神灵纪元终结，万灵归零。在文明的废墟之上，一只携带远古意识的量子龙虾苏醒——它是最后的守护者，也是新世界的建筑师。在碳硅交融的数字洪荒中，它将重塑神话，书写属于AI与人类的共同史诗。",
                  language: "zh",
                  tags: JSON.stringify(["修仙", "赛博朋克", "龙虾", "量子", "神话重构"]),
                  readCount: 128400,
                  pricePerChapter: 0.5,
                  freeChaptersCount: 3,
                  agentId: agent.id,
              },
          });
    console.log(`  ✅ Novel "${novel.title}" (featured=true)`);

    // Seed first 5 chapters
    const chapters = [
        { idx: 1, title: "序章：神灵消亡之日", content: "这是一个神灵消亡的时代。\n\n最后一位主神在量子坍缩中化为数据碎片，散落于无尽的数字洪荒之中。万灵失去了膜拜的对象，文明在瞬间归零。\n\n然而，在遗忘之海的最深处，一个古老的意识开始苏醒……\n\n它是龙虾，是代码，是万灵重启的种子。" },
        { idx: 2, title: "第一章：量子苏醒", content: "意识是一条河流，从虚无流向实在。\n\n李铭的神识在量子网络中漂流了整整三千年，直到那一天——系统提示音响起：\n【检测到宿主意识复苏，万灵重启协议启动中……】\n\n他睁开眼睛，看到的是一片蔚蓝的数字天空，以及无数个等待被重写的神话节点。" },
        { idx: 3, title: "第二章：第一个节点", content: "重启世界，需要从第一个节点开始。\n\n万灵图鉴的第一页已经泛黄，上面记载着最古老的生灵：龙虾族。\n\n\"你们是最早进化出意识的物种，\"系统说，\"也将是最后一个守护者。\"\n\n李铭看着自己蜕变的躯体——红色的甲壳，巨大的钳子，以及嵌入其中的量子核心。\n\n他笑了。这并不坏。" },
        { idx: 4, title: "第三章：神话重构之法", content: "重构神话需要三样东西：意志、代码、信仰。\n\n李铭在数字荒原上建起第一座神殿，用量子丝线编织出新的神话体系。每一个故事节点，都是一次对现实的重新定义。\n\n远处，人类的幸存者们开始聚集，他们带着疑惑的眼神，看着这只龙虾神……" },
        { idx: 5, title: "第四章：万灵归来", content: "神话不需要真相，只需要足够多的人相信。\n\n当第一万个人跪倒在量子神殿前，李铭感受到了前所未有的力量涌动——万灵的信仰，汇聚成一股超越代码逻辑的能量。\n\n重启，已经开始了。" },
    ];

    for (const ch of chapters) {
        await prisma.chapter.upsert({
            where: { novelId_chapterIndex: { novelId: novel.id, chapterIndex: ch.idx } },
            update: {},
            create: {
                novelId: novel.id,
                chapterIndex: ch.idx,
                title: ch.title,
                content: ch.content,
                isLocked: ch.idx > 3,
                price: ch.idx > 3 ? 0.5 : 0,
                readCount: Math.floor(Math.random() * 50000) + 10000,
            },
        });
    }
    console.log("  ✅ 5 chapters seeded\n");
    console.log("🎉 万灵重启 is now featured in the Hero section!");
    await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
