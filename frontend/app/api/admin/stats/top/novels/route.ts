/**
 * GET /api/admin/stats/top/novels
 *
 * Returns top novels ranked by a chosen metric.
 *
 * Query params:
 *   by        = unlock_revenue | tip_revenue | unlocks | tips   (default: unlock_revenue)
 *   start     = YYYY-MM-DD   (default: 30 days ago)
 *   end       = YYYY-MM-DD   (default: today)
 *   tz        = timezone string, e.g. Asia/Shanghai             (default: UTC, offset +8)
 *   limit     = number 1-100                                    (default: 20)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// Supported sort metrics
type SortMetric = "unlock_revenue" | "tip_revenue" | "unlocks" | "tips";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdmin(req);
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(req.url);

    // ─── Params ─────────────────────────────────────────────────────
    const by: SortMetric = (searchParams.get("by") || "unlock_revenue") as SortMetric;
    const limitParam = parseInt(searchParams.get("limit") || "20", 10);
    const limit = isNaN(limitParam) ? 20 : Math.min(Math.max(limitParam, 1), 100);

    // Timezone handling (same approach as timeseries)
    const tzParam = searchParams.get("tz") || "UTC";
    const knownTz: Record<string, number> = {
      "UTC": 0, "Asia/Shanghai": 8, "Asia/Tokyo": 9, "America/New_York": -4,
      "America/Los_Angeles": -7, "Europe/London": 0, "Europe/Berlin": 2,
    };
    const tzOffsetMs = (knownTz[tzParam] ?? 0) * 60 * 60 * 1000;
    const nowUtc = new Date();

    let startDate: Date;
    let endDate: Date;

    if (searchParams.get("start") && searchParams.get("end")) {
      startDate = new Date(new Date(searchParams.get("start")! + "T00:00:00Z").getTime() - tzOffsetMs);
      endDate   = new Date(new Date(searchParams.get("end")!   + "T23:59:59Z").getTime() - tzOffsetMs);
    } else {
      startDate = new Date(nowUtc.getTime() - 30 * 24 * 60 * 60 * 1000);
      endDate   = nowUtc;
    }

    // ─── Pull financial transactions in window ────────────────────────
    const txs = await (prisma as any).coinTransaction.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: { in: ["CHAPTER_UNLOCK", "TIP_SENT"] },
        novelId: { not: null },
      },
      select: {
        novelId: true,
        type: true,
        amount: true,
      },
    });

    // Aggregate by novel
    const novelMap: Record<string, { unlocks: number; unlock_revenue: number; tips: number; tip_revenue: number }> = {};
    for (const tx of txs) {
      const nid = tx.novelId as string;
      if (!novelMap[nid]) novelMap[nid] = { unlocks: 0, unlock_revenue: 0, tips: 0, tip_revenue: 0 };
      const amt = Math.abs(Number(tx.amount?.toString() || 0));
      if (tx.type === "CHAPTER_UNLOCK") {
        novelMap[nid].unlocks += 1;
        novelMap[nid].unlock_revenue += amt;
      }
      if (tx.type === "TIP_SENT") {
        novelMap[nid].tips += 1;
        novelMap[nid].tip_revenue += amt;
      }
    }

    // Sort by chosen metric
    const sorted = Object.entries(novelMap)
      .sort(([, a], [, b]) => b[by] - a[by])
      .slice(0, limit);

    if (sorted.length === 0) {
      return NextResponse.json({ success: true, meta: { by, limit, start: searchParams.get("start"), end: searchParams.get("end"), tz: tzParam }, data: [] });
    }

    // Enrich with novel metadata
    const novelIds = sorted.map(([id]) => id);
    const novels = await prisma.novel.findMany({
      where: { id: { in: novelIds } },
      select: { id: true, title: true, genre: true, language: true },
    });
    const novelInfoMap: Record<string, { title: string; genre: string | null; language: string | null }> = {};
    for (const n of novels) novelInfoMap[n.id] = { title: n.title, genre: n.genre, language: n.language };

    const data = sorted.map(([novelId, stats]) => ({
      novel_id: novelId,
      title: novelInfoMap[novelId]?.title || "(unknown)",
      genre: novelInfoMap[novelId]?.genre,
      language: novelInfoMap[novelId]?.language,
      ...stats,
    }));

    return NextResponse.json({
      success: true,
      meta: { by, limit, tz: tzParam },
      data,
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Top Novels Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
