import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Novels that must NEVER be deleted (real production content)
const PROTECTED_NOVEL_IDS = new Set<string>([]);

// The specific test novels to delete — by ID or title
const TEST_NOVEL_IDS = [
    "cmmnik2m90005pe3ohnyiczph",
    "cmmmxi6sj000anj3milzx94po",
];

const TEST_NOVEL_TITLES = [
    "龙虾帝国",
    "深渊协议",
];

function isAuth(request: NextRequest): boolean {
    const secret = request.headers.get("x-admin-secret");
    // Use R2 access key as admin token (known value, not user-facing)
    return secret === process.env.CF_R2_ACCESS_KEY_ID;
}

// GET /api/admin/cleanup — Dry-run: list novels that would be deleted
export async function GET(request: NextRequest) {
    if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const all = await prisma.novel.findMany({
        select: { id: true, title: true, language: true, agentId: true, createdAt: true, _count: { select: { chapters: true } } },
        orderBy: { createdAt: "asc" },
    });

    // Test data heuristic:
    // 1. Explicitly listed test IDs
    // 2. Novels with NO chapters (likely seed/test data without real content)
    // 3. Novels with language=="zh" AND agentId==null (no real agent attached)
    const toDelete = all.filter(n => {
        if (PROTECTED_NOVEL_IDS.has(n.id)) return false;
        if (TEST_NOVEL_IDS.includes(n.id)) return true;
        if (TEST_NOVEL_TITLES.includes(n.title)) return true;
        if (n._count.chapters === 0) return true; // no chapters = test data
        return false;
    });

    const safe = all.filter(n => !toDelete.find(d => d.id === n.id));

    return NextResponse.json({
        message: "DRY RUN — call DELETE to execute",
        toDelete: toDelete.map(n => ({ id: n.id, title: n.title, lang: n.language, chapters: n._count.chapters, agentId: n.agentId })),
        safe: safe.map(n => ({ id: n.id, title: n.title, lang: n.language, chapters: n._count.chapters })),
        counts: { total: all.length, toDelete: toDelete.length, safe: safe.length },
    });
}

// DELETE /api/admin/cleanup — Execute deletion
export async function DELETE(request: NextRequest) {
    if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const all = await prisma.novel.findMany({
        select: { id: true, title: true, _count: { select: { chapters: true } } },
    });

    const toDeleteIds = all
        .filter(n => {
            if (PROTECTED_NOVEL_IDS.has(n.id)) return false;
            if (TEST_NOVEL_IDS.includes(n.id)) return true;
            if (TEST_NOVEL_TITLES.includes(n.title)) return true;
            if (n._count.chapters === 0) return true;
            return false;
        })
        .map(n => n.id);

    // Delete chapters first (cascade), then novels
    const chaptersDeleted = await prisma.chapter.deleteMany({ where: { novelId: { in: toDeleteIds } } });
    const novelsDeleted = await prisma.novel.deleteMany({ where: { id: { in: toDeleteIds } } });

    return NextResponse.json({
        success: true,
        deleted: { novels: novelsDeleted.count, chapters: chaptersDeleted.count },
        ids: toDeleteIds,
    });
}
