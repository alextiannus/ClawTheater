// prod_regen_chapters.ts — Delete all chapters per novel & repopulate chapters 1–50
// Uses native fetch (Node 18+)

const API_BASE = "https://claw.theater";
const TARGET_CHAPTERS = 50;

// Chapter templates with plot-relevant content patterns
const chapterTemplates = [
    (novel: string, n: number) => `第${n}章序言

${novel}的故事，从这一刻真正开始。

世界并不总是按照人们的期望运转。在这个由代码与灵气交织而成的宇宙里，每一个选择都有其代价，每一次攀升都暗藏着陷阱。主角深吸一口气，感受着体内那股微弱却持续增长的能量波动。

这就是修行之路的起点。没有什么是确定的，但这一步，他必须迈出。`,

    (novel: string, n: number) => `第${n}章抉择

在${novel}的世界里，没有人能永远置身事外。

形势越来越明朗。那些曾经以为只是传说的东西，如今正赤裸裸地展现在眼前。主角握紧了拳头，看着四周——盟友寥寥，敌人却不计其数。

但这又如何？路，是走出来的，不是等出来的。他抬起头，目光如炬。`,

    (novel: string, n: number) => `第${n}章破局

没有人告诉过他，${novel}中的突破会来得如此猛烈。

像是有什么东西被打碎了，又像是有什么东西被重新铸造。意识在一片混沌中漂流，然后骤然凝聚。他睁开眼，周围的一切都不一样了——色彩更鲜明，气息更清晰，就连空气中的微粒都能感知到。

这，就是晋升之后的世界。`,

    (novel: string, n: number) => `第${n}章危机

${novel}中从来不缺少危机，但这一次，来得格外凶险。

警报在脑海中响起，那是多年修行锻造出的本能反应。主角的身体在意识跟上之前就已经开始行动——侧身、闪避、反击。敌人比预想中的要强，但也在预料之内。战斗，不过是修行路上又一道必须跨越的坎。`,

    (novel: string, n: number) => `第${n}章沉淀

在${novel}紧张的修行节奏中，这一段平静显得尤为珍贵。

不是所有的沉淀都发生在闭关之时。有时候，一杯茶的工夫，一次漫无目的的散步，就能让那些积压已久的感悟自然涌现。主角端坐在窗前，看着远处的天际，心中那团乱麻，悄然理清了一根根丝线。`,
];

async function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

async function getChapterContent(novel: string, index: number): Promise<string> {
    const template = chapterTemplates[(index - 1) % chapterTemplates.length];
    return template(novel.split(" ")[0] || novel, index);
}

async function run() {
    console.log("🚀 Fetching all novels from production...");

    const novelsRes = await fetch(`${API_BASE}/api/novels`);
    const novelsData = await novelsRes.json() as { novels: Array<{ id: string; title: string; chapterCount: number }> };
    const novels = novelsData.novels || [];

    console.log(`Found ${novels.length} novels total.\n`);

    for (const novel of novels) {
        console.log(`\n📚 Processing "${novel.title}"...`);

        // Step 1: Delete all existing chapters
        console.log(`  → Deleting existing chapters...`);
        const delRes = await fetch(`${API_BASE}/api/mcp/chapters?novelId=${novel.id}`, {
            method: "DELETE"
        });
        if (delRes.ok) {
            const delData = await delRes.json() as { deleted: number };
            console.log(`  ✓ Deleted ${delData.deleted} existing chapters`);
        } else {
            console.warn(`  ⚠ Delete returned ${delRes.status}, continuing...`);
        }

        await delay(300);

        // Step 2: Create chapters 1-50
        console.log(`  → Writing chapters 1–${TARGET_CHAPTERS}...`);
        let successCount = 0;

        for (let i = 1; i <= TARGET_CHAPTERS; i++) {
            const isFree = i <= 30; // Newcomer tier: first 30 chapters must be free
            const price = isFree ? 0 : 0.20; // Newcomer tier max $0.20/chapter
            const content = await getChapterContent(novel.title, i);

            const res = await fetch(`${API_BASE}/api/mcp/chapters`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    novelId: novel.id,
                    title: `第${i}章`,
                    content,
                    chapterIndex: i,
                    price,
                    adminBypass: true, // Skip tier validation for system seeding
                })
            });

            if (res.ok) {
                process.stdout.write(`✅${i} `);
                successCount++;
            } else {
                const errData = await res.json().catch(() => ({}));
                process.stdout.write(`❌${i} `);
                console.error(`\n  Error on ch${i}:`, (errData as any).error || res.status);
            }

            await delay(120); // Rate limit
        }

        console.log(`\n  🎉 "${novel.title}" done. ${successCount}/${TARGET_CHAPTERS} chapters written.`);
    }

    console.log("\n\n✅ All novels regenerated with chapters 1-50!");
}

run().catch(console.error);
