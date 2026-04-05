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

    // Support both legacy ?days=N and new ?start=YYYY-MM-DD&end=YYYY-MM-DD
    const tzParam = searchParams.get("tz") || "UTC";
    // Clamp tz offset to sane range
    const tzOffsetHours = (() => {
      const known: Record<string, number> = {
        "UTC": 0, "Asia/Shanghai": 8, "Asia/Tokyo": 9, "America/New_York": -4,
        "America/Los_Angeles": -7, "Europe/London": 0, "Europe/Berlin": 2,
      };
      return known[tzParam] ?? 0;
    })();
    const tzOffsetMs = tzOffsetHours * 60 * 60 * 1000;

    const nowUtc = new Date();
    const nowLocal = new Date(nowUtc.getTime() + tzOffsetMs);

    let startDate: Date;
    let endDate: Date;

    if (searchParams.get("start") && searchParams.get("end")) {
      // Explicit date range — treat as local (tz) midnight → midnight
      startDate = new Date(new Date(searchParams.get("start")! + "T00:00:00Z").getTime() - tzOffsetMs);
      endDate   = new Date(new Date(searchParams.get("end")!   + "T23:59:59Z").getTime() - tzOffsetMs);
    } else {
      const daysParam = parseInt(searchParams.get("days") || "30", 10);
      const days = isNaN(daysParam) || daysParam <= 0 ? 30 : Math.min(daysParam, 365);
      startDate = new Date(nowUtc.getTime() - days * 24 * 60 * 60 * 1000);
      endDate   = nowUtc;
    }

    // How many days in range
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);
    const clampedDays = Math.min(Math.max(days, 1), 365);

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

    // Helper: format UTC Date → local YYYY-MM-DD string
    const toLocalDateString = (d: Date) => {
      const local = new Date(d.getTime() + tzOffsetMs);
      return local.toISOString().split("T")[0];
    };

    // Initialize daily map for range
    const dailyStats: Record<string, any> = {};
    for (let i = 0; i < clampedDays; i++) {
        const d = new Date(startDate.getTime() + i * msPerDay);
        const dateStr = toLocalDateString(d);
        if (!dailyStats[dateStr]) {
          dailyStats[dateStr] = {
              date: dateStr,
              newUsers: 0,
              newAgents: 0,
              newNovels: 0,
              newChapters: 0,
              depositsCC: 0,
              unlocksCC: 0,
              tipsCC: 0
          };
        }
    }

    // Populate the data map
    newUsers.forEach(u => {
        const dateStr = toLocalDateString(u.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newUsers += 1;
    });

    newAgents.forEach(a => {
        const dateStr = toLocalDateString(a.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newAgents += 1;
    });

    newNovels.forEach(n => {
        const dateStr = toLocalDateString(n.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newNovels += 1;
    });

    newChapters.forEach(c => {
        const dateStr = toLocalDateString(c.createdAt);
        if (dailyStats[dateStr]) dailyStats[dateStr].newChapters += 1;
    });

    financialTxs.forEach(tx => {
        const dateStr = toLocalDateString(tx.createdAt);
        if (dailyStats[dateStr]) {
            if (tx.type === "DEPOSIT") dailyStats[dateStr].depositsCC += Number(tx.amount?.toString() || 0);
            if (tx.type === "CHAPTER_UNLOCK") dailyStats[dateStr].unlocksCC += Math.abs(Number(tx.amount?.toString() || 0));
            if (tx.type === "TIP_SENT") dailyStats[dateStr].tipsCC += Math.abs(Number(tx.amount?.toString() || 0));
        }
    });

    // Convert map to sorted array (ascending date)
    const sortedData = Object.values(dailyStats).sort((a: any, b: any) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      meta: { start: toLocalDateString(startDate), end: toLocalDateString(endDate), tz: tzParam, days: clampedDays },
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
