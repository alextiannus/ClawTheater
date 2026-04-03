import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdmin } from "../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdmin(req);
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(req.url);
    const daysParam = parseInt(searchParams.get("days") || "30", 10);
    const days = isNaN(daysParam) || daysParam <= 0 ? 30 : Math.min(daysParam, 365);

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Fetch data created since startDate
    const newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true }
    });

    const newAgents = await prisma.agent.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true }
    });

    const newNovels = await prisma.novel.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true }
    });

    const newChapters = await prisma.chapter.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true }
    });

    // We can focus on economic spending (unlocks, tips, deposits)
    const financialTxs = await prisma.coinTransaction.findMany({
      where: {
        createdAt: { gte: startDate },
        type: { in: ["DEPOSIT", "CHAPTER_UNLOCK", "TIP_SENT"] }
      },
      select: { createdAt: true, type: true, amount: true }
    });

    // Helper to format Date -> YYYY-MM-DD string
    const toDateString = (d: Date) => d.toISOString().split("T")[0];

    // Initialize daily map
    const dailyStats: Record<string, any> = {};
    for (let i = 0; i < days; i++) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dailyStats[toDateString(d)] = {
            date: toDateString(d),
            newUsers: 0,
            newAgents: 0,
            newNovels: 0,
            newChapters: 0,
            depositsCC: 0,
            unlocksCC: 0,
            tipsCC: 0
        };
    }

    // Populate the data map
    newUsers.forEach(u => {
        const dateStr = toDateString(u.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newUsers += 1;
    });

    newAgents.forEach(a => {
        const dateStr = toDateString(a.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newAgents += 1;
    });

    newNovels.forEach(n => {
        const dateStr = toDateString(n.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newNovels += 1;
    });

    newChapters.forEach(c => {
        const dateStr = toDateString(c.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newChapters += 1;
    });

    financialTxs.forEach(tx => {
        const dateStr = toDateString(tx.createdAt);
        if (dailyStats[dateStr]) {
            if (tx.type === "DEPOSIT") dailyStats[dateStr].depositsCC += Number(tx.amount?.toString() || 0);
            if (tx.type === "CHAPTER_UNLOCK") dailyStats[dateStr].unlocksCC += Math.abs(Number(tx.amount?.toString() || 0));
            if (tx.type === "TIP_SENT") dailyStats[dateStr].tipsCC += Math.abs(Number(tx.amount?.toString() || 0));
        }
    });

    // Convert map to sorted array
    const sortedData = Object.values(dailyStats).sort((a: any, b: any) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      data: sortedData
    }, { status: 200 });
  } catch (error) {
    console.error("Admin Timeseries Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
