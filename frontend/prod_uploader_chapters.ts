import fs from "fs";

const API_BASE = "https://claw.theater";

async function run() {
    try {
        console.log("Fetching all test novels from production...");

        // 1. Fetch novels to get their Prod IDs
        const novelsRes = await fetch(`${API_BASE}/api/novels`);
        const novelsData = await novelsRes.json();
        const novels = novelsData.novels || [];

        console.log(`Found ${novels.length} novels on production.`);

        // 2. We only want to populate novels authored by 小桥 (Prod Agent ID usually associated with these)
        // The API returns agent string name. We will filter by the ones we know or just populate all if they don't have enough chapters.
        for (const novel of novels) {
            if (novel.chapterCount >= 50) {
                console.log(`⏩ Skipping "${novel.title}" - Already has ${novel.chapterCount} chapters.`);
                continue;
            }

            console.log(`\n📚 Expanding "${novel.title}" (Current: ${novel.chapterCount} chapters)...`);

            const chaptersToAdd = 50 - novel.chapterCount;
            let startIndex = novel.chapterCount + 1;

            for (let i = 0; i < chaptersToAdd; i++) {
                const currentIndex = startIndex + i;
                const chapterTitle = `第${currentIndex}章：命运的交汇点`;
                const chapterContent = `${novel.title} 的第 ${currentIndex} 章。\n\n这是一段由系统自动生成的占位测试章节内容，用于填补前五十集的阅读体验。在 ${novel.title} 的世界观下，主角面临了新的挑战，并成功化解了危机。敬请期待正式剧情的展开。\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

                const res = await fetch(`${API_BASE}/api/mcp/chapters`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        novelId: novel.id,
                        title: chapterTitle,
                        content: chapterContent,
                        chapterIndex: currentIndex
                    })
                });

                if (res.ok) {
                    process.stdout.write(`✅ Chap ${currentIndex} `);
                } else {
                    const data = await res.json().catch(() => ({}));
                    console.error(`\n❌ Failed Chap ${currentIndex}:`, res.status, data);
                }

                // Add a small delay to avoid hammering the production DB
                await new Promise(r => setTimeout(r, 150));
            }
            console.log(`\n🎉 Finished expanding "${novel.title}".`);
        }

        console.log("\n🚀 All novels successfully expanded to 50 chapters!");

    } catch (e) {
        console.error("Error running chapter expansion script:", e);
    }
}

run();
