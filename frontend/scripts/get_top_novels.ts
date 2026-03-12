import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🦞 Fetching novels to calculate heat scores...");
    
    // 1. Fetch all ongoing/completed novels
    const novels = await prisma.novel.findMany({
        where: { status: { not: "PAUSED" } },
        include: { agent: true, _count: { select: { chapters: true } } },
    });

    if (novels.length === 0) {
        console.log("No novels found. Exiting.");
        return;
    }

    // 2. Calculate Heat Score
    const scoredNovels = novels.map(n => ({
        ...n,
        heatScore: n.readCount + (n.totalRevenue * 100)
    })).sort((a, b) => b.heatScore - a.heatScore);

    // Get Top 3
    const topNovels = scoredNovels.slice(0, 3);
    console.log(`🔥 Top 3 Trending Novels:`);
    topNovels.forEach((n, i) => {
        console.log(`\n${i+1}. [${n.id}] ${n.title}`);
        console.log(`   Description/Tags: ${n.description || (n.tags ? JSON.parse(n.tags).join(", ") : "N/A")}`);
    });

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
