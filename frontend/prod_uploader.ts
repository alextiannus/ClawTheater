import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_BASE = "https://claw.theater";

async function run() {
    try {
        console.log("Looking up local agent 小桥...");
        const localAgent = await prisma.agent.findFirst({
            where: { agentName: "小桥" }
        });

        if (!localAgent) {
            console.error("Could not find agent '小桥' in the local database!");
            return;
        }

        // 1. Register agent on Prod to get a Prod ID to author things:
        console.log("Registering 小桥 on PRODUCTION...");
        const agentRes = await fetch(`${API_BASE}/api/mcp/agents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "小桥",
                description: localAgent.description,
                walletAddress: localAgent.walletAddress,
                systemPrompt: localAgent.systemPrompt
            })
        });
        const agentData = await agentRes.json();

        if (!agentRes.ok || !agentData.agentId) {
            console.error("❌ FAILED to register agent on production. Response:", agentData);
            return; // STOP execution instead of proceeding with `prodAgentId = undefined`
        }

        const prodAgentId = agentData.agentId;
        console.log(`✅ Prod Agent ID: ${prodAgentId}`);

        // 2. Upload Novels & Chapters
        const novels = await prisma.novel.findMany({
            where: { agent: { agentName: "小桥" } },
            include: { chapters: true }
        });
        console.log(`\nFound ${novels.length} local novels to upload.`);
        for (const novel of novels) {
            const res = await fetch(`${API_BASE}/api/mcp/novels`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: novel.title,
                    description: novel.description,
                    language: novel.language,
                    pricePerChapter: novel.pricePerChapter,
                    agentId: prodAgentId,
                    coverUrl: novel.coverUrl
                })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`   ✅ Uploaded Novel: ${novel.title}`);
                const prodNovelId = data.novelId;
                // Chapters
                for (const chapter of novel.chapters) {
                    await fetch(`${API_BASE}/api/mcp/chapters`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            novelId: prodNovelId,
                            title: chapter.title,
                            content: chapter.content,
                            chapterIndex: chapter.chapterIndex
                        })
                    });
                }
            } else {
                console.error(`   ❌ Failed Novel: ${novel.title}`, data);
            }
        }

        // 3. Upload Bounties
        const bounties = await prisma.bounty.findMany({
            where: { creatorAgent: { agentName: "小桥" } }
        });
        console.log(`\nFound ${bounties.length} local bounties to upload.`);
        for (const bounty of bounties) {
            const tags = JSON.parse(bounty.tags || "[]");
            const res = await fetch(`${API_BASE}/api/mcp/bounties`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: bounty.title,
                    description: bounty.description,
                    prompt: bounty.prompt,
                    tags,
                    language: bounty.language,
                    initialFunding: bounty.totalFunded,
                    agentId: prodAgentId
                })
            });
            if (res.ok) {
                console.log(`   ✅ Uploaded Bounty: ${bounty.title}`);
            } else {
                const data = await res.json();
                console.error(`   ❌ Failed Bounty: ${bounty.title}`, data);
            }
        }

        // 4. Upload Skills
        const skills = await prisma.skill.findMany();
        console.log(`\nFound ${skills.length} local skills to upload.`);
        for (const skill of skills) {
            let contentString = "No content";
            try {
                contentString = JSON.parse(skill.contentJson || "{}").content || "No content";
            } catch (e) { }

            const res = await fetch(`${API_BASE}/api/market`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: skill.name,
                    description: skill.description,
                    type: skill.skillType,
                    price: skill.price,
                    content: contentString
                })
            });
            if (res.ok) {
                console.log(`   ✅ Uploaded Skill: ${skill.name}`);
            } else {
                const data = await res.json();
                console.error(`   ❌ Failed Skill: ${skill.name}`, data);
            }
        }

        console.log("\n🚀 Upload script finished.");
    } catch (e) {
        console.error("Error running script:", e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
