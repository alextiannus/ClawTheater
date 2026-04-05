/**
 * GET /api/admin/ledger
 *
 * Paginated, auditable financial ledger for all platform transactions.
 * No PII is returned (no email/phone/name).
 *
 * Query params:
 *   start     = YYYY-MM-DD          (default: 30 days ago)
 *   end       = YYYY-MM-DD          (default: today)
 *   tz        = timezone string     (default: UTC)
 *   type      = DEPOSIT|CHAPTER_UNLOCK|TIP_SENT|TIP_RECEIVED|SKILL_PURCHASE
 *               comma-separated for multiple, empty = all
 *   cursor    = last seen transaction ID for cursor-based pagination
 *   limit     = 10-100              (default: 50)
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdmin(req);
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(req.url);

    // ─── Timezone ────────────────────────────────────────────────────
    const tzParam = searchParams.get("tz") || "UTC";
    const knownTz: Record<string, number> = {
      "UTC": 0, "Asia/Shanghai": 8, "Asia/Tokyo": 9, "America/New_York": -4,
      "America/Los_Angeles": -7, "Europe/London": 0, "Europe/Berlin": 2,
    };
    const tzOffsetMs = (knownTz[tzParam] ?? 0) * 60 * 60 * 1000;
    const nowUtc = new Date();

    // ─── Date range ──────────────────────────────────────────────────
    let startDate: Date;
    let endDate: Date;

    if (searchParams.get("start") && searchParams.get("end")) {
      startDate = new Date(new Date(searchParams.get("start")! + "T00:00:00Z").getTime() - tzOffsetMs);
      endDate   = new Date(new Date(searchParams.get("end")!   + "T23:59:59Z").getTime() - tzOffsetMs);
    } else {
      startDate = new Date(nowUtc.getTime() - 30 * 24 * 60 * 60 * 1000);
      endDate   = nowUtc;
    }

    // ─── Filters ─────────────────────────────────────────────────────
    const typeFilter = searchParams.get("type");
    const types = typeFilter
      ? typeFilter.split(",").map(t => t.trim()).filter(Boolean)
      : undefined;

    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const limit = isNaN(limitParam) ? 50 : Math.min(Math.max(limitParam, 10), 100);

    const cursor = searchParams.get("cursor") || undefined;

    // ─── Query ───────────────────────────────────────────────────────
    // We import prisma lazily to avoid top-level import issues in edge
    const { prisma } = await import("@/app/lib/prisma");

    const where: any = {
      createdAt: { gte: startDate, lte: endDate },
    };
    if (types && types.length > 0) where.type = { in: types };
    if (cursor) where.id = { lt: cursor }; // cursor pagination: items before this ID

    const txs = await (prisma as any).coinTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1, // fetch one extra to determine hasMore
      select: {
        id: true,
        createdAt: true,
        type: true,
        amount: true,
        userId: true,       // anonymised — internal ID only
        agentId: true,      // anonymised
        novelId: true,
        chapterId: true,
        // Deliberately exclude: email, displayName, walletAddress
      },
    });

    const hasMore = txs.length > limit;
    const items = hasMore ? txs.slice(0, limit) : txs;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    // Format timestamps in chosen timezone
    const toLocalIso = (d: Date) => new Date(d.getTime() + tzOffsetMs).toISOString().replace("Z", `${tzOffsetMs >= 0 ? "+" : "-"}${String(Math.abs(tzOffsetMs / 3600000)).padStart(2, "0")}:00`);

    const data = items.map((tx: any) => ({
      transaction_id: tx.id,
      timestamp: toLocalIso(tx.createdAt),
      type: tx.type,
      amount: Number(tx.amount?.toString() || 0),
      currency: "CC",
      user_id: tx.userId,
      agent_id: tx.agentId,
      novel_id: tx.novelId,
      chapter_id: tx.chapterId,
    }));

    return NextResponse.json({
      success: true,
      meta: {
        start: searchParams.get("start"),
        end: searchParams.get("end"),
        tz: tzParam,
        limit,
        has_more: hasMore,
        next_cursor: nextCursor,
        count: data.length,
      },
      data,
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Ledger Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
