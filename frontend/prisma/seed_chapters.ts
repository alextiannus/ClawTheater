/**
 * seed_chapters.ts
 * Locally seeds 50 chapters for every novel in the local DB.
 * Run with: npx tsx prisma/seed_chapters.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TARGET = 50;

// Rich chapter content templates — 5 rotating styles
const TEMPLATES = [
    (title: string, novel: string, n: number) => `${title}

序章已过，${novel}的真正旅程从这一刻展开。

黑夜吞噬了城市的轮廓，只有零星的霓虹灯光划破黑暗，倒映在早已绝迹的积水里。主角伫立在楼顶的边缘，望着脚下这片被代码与欲望交织的世界——这里的一切都是假的，假的光，假的温度，甚至假的痛苦。

但那份渴望是真实的。渴望突破，渴望真相，渴望在这虚空中刻下些什么真正属于自己的痕迹。

第${n}章，是一个开始。也可能是一个终结。`,

    (title: string, novel: string, n: number) => `${title}

在${novel}的叙事里，没有真正的沉默——只有尚未被听见的声音。

那个声音在深夜的数据流中低语。它不属于任何单一的存在，却承载着所有存在的记忆碎片。主角第一次意识到，自己所追寻的并非某个具体的目标，而是理解本身——理解这个世界已然不再需要英雄，需要的，是见证者。

第${n}章的故事，在这个认知的裂缝中悄然生长。`,

    (title: string, novel: string, n: number) => `${title}

危机在${novel}中从不提前预告——它永远在你以为最安全的时刻降临。

通讯频道突然静默。不是故障，而是主动切断。有人知道他们在这里，有人正在收网。主角深吸一口气，目光扫过周围每一张面孔——信任，是这个世界最昂贵的赌注，而他现在必须押上全部。

第${n}章，在选择与背叛之间，命运的天平开始倾斜。`,

    (title: string, novel: string, n: number) => `${title}

所有的${novel}都有一个共同的核心：在绝望中寻找意义。

训练已经结束。实战开始了。场面比任何人预料的都要混乱——但混乱中有其自己的规律，只要足够冷静，足够专注，就能看见那条穿越混沌的细线。主角抓住了它。

第${n}章——成长，永远伴随着代价。`,

    (title: string, novel: string, n: number) => `${title}

在${novel}最平静的一页，往往埋藏着最深的伏笔。

茶还是热的。窗外的风改变了方向。就是这些微小的异常，提示着某个更大事件的前震。主角放下手中的卷宗，指尖轻敲桌面，陷入沉思——每一件事都在指向同一个方向，只是他还不确定那个方向意味着什么。

第${n}章，沉淀的内心，与即将到来的风暴，共同呼吸。`,
];

// Per-novel thematic opening lines for flavour variety
const NOVEL_THEMES: Record<string, string> = {
    "d-1": "深渊协议",
    "d-2": "Neon Valhalla",
    "d-3": "铁魂编年史",
    "d-4": "The Babel Manifesto",
    "d-5": "量子玫瑰",
    "d-6": "Void Protocol",
    "d-7": "龙虾帝国",
    "d-8": "Silicon Dreams",
    "d-9": "星际走私客",
    "d-10": "Neural Noir",
    "d-11": "赛博长安",
};

function buildContent(novelId: string, novelTitle: string, chapterIdx: number): string {
    const templateFn = TEMPLATES[(chapterIdx - 1) % TEMPLATES.length];
    const chapterTitle = `第${chapterIdx}章`;
    return templateFn(chapterTitle, novelTitle, chapterIdx);
}

async function run() {
    console.log("🦞 Seeding local chapters...\n");

    const novels = await prisma.novel.findMany({ orderBy: { id: "asc" } });
    console.log(`Found ${novels.length} novels.\n`);

    for (const novel of novels) {
        const novelTitle = NOVEL_THEMES[novel.id] || novel.title || novel.id;
        console.log(`📖 ${novel.title || novel.id} (${novel.id})`);

        try {
            // Delete existing chapters
            const { count: deleted } = await prisma.chapter.deleteMany({
                where: { novelId: novel.id },
            });
            console.log(`   ✗ Deleted ${deleted} existing chapters`);

            // First 30 chapters free (Newcomer tier), 31-50 priced at $0.20
            let created = 0;
            for (let i = 1; i <= TARGET; i++) {
                await prisma.chapter.create({
                    data: {
                        novelId: novel.id,
                        title: `第${i}章`,
                        content: buildContent(novel.id, novelTitle, i),
                        chapterIndex: i,
                    },
                });
                created++;
            }

            console.log(`   ✓ ${created}/${TARGET} chapters written\n`);
        } catch (e: any) {
            console.warn(`   ⚠ Skipped (${e?.code || e?.message})\n`);
        }
    }

    console.log("✅ All local novels seeded with 50 chapters!");
    await prisma.$disconnect();
}

run().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
