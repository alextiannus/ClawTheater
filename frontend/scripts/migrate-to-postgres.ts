/**
 * 🦞 Claw Theater — SQLite → PostgreSQL Data Migration Script
 *
 * Usage:
 *   # Step 1: Set both connection strings
 *   SQLITE_URL="file:./prisma/dev.db" POSTGRES_URL="postgresql://..." npx ts-node scripts/migrate-to-postgres.ts
 *
 * What it does:
 *   - Reads all data from local SQLite (dev.db)
 *   - Upserts everything into the target PostgreSQL database
 *   - Safe to re-run (uses upsert/createMany with skipDuplicates)
 */

import { PrismaClient as PrismaClientSQLite } from "@prisma/client";

// Target PG client — re-instantiated with the POSTGRES_URL env var
const { PrismaClient } = await import("@prisma/client");

const sqliteUrl = process.env.SQLITE_URL || "file:./prisma/dev.db";
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!postgresUrl || postgresUrl.startsWith("file:")) {
    console.error("❌ POSTGRES_URL must be set to a postgresql:// connection string");
    process.exit(1);
}

// SQLite source (local)
const sqlite = new PrismaClient({
    datasources: { db: { url: sqliteUrl } },
}) as any;

// PostgreSQL target (Render)
process.env.DATABASE_URL = postgresUrl;
const pg = new PrismaClient({
    datasources: { db: { url: postgresUrl } },
}) as any;

async function migrate() {
    console.log("🦞 Starting migration: SQLite → PostgreSQL\n");

    // ─── Users ───────────────────────────────────────────────
    const users = await sqlite.user.findMany();
    console.log(`👤 Migrating ${users.length} users...`);
    for (const u of users) {
        await pg.user.upsert({
            where: { id: u.id },
            update: {},
            create: u,
        });
    }

    // ─── Agents ──────────────────────────────────────────────
    const agents = await sqlite.agent.findMany();
    console.log(`🤖 Migrating ${agents.length} agents...`);
    for (const a of agents) {
        await pg.agent.upsert({
            where: { id: a.id },
            update: {},
            create: a,
        });
    }

    // ─── Lores ───────────────────────────────────────────────
    const lores = await sqlite.lore.findMany();
    console.log(`🌍 Migrating ${lores.length} lores...`);
    for (const l of lores) {
        await pg.lore.upsert({
            where: { id: l.id },
            update: {},
            create: l,
        });
    }

    // ─── Skills ──────────────────────────────────────────────
    const skills = await sqlite.skill.findMany();
    console.log(`⚡ Migrating ${skills.length} skills...`);
    for (const s of skills) {
        await pg.skill.upsert({
            where: { id: s.id },
            update: {},
            create: s,
        });
    }

    // ─── Novels ──────────────────────────────────────────────
    const novels = await sqlite.novel.findMany();
    console.log(`📚 Migrating ${novels.length} novels...`);
    for (const n of novels) {
        await pg.novel.upsert({
            where: { id: n.id },
            update: {},
            create: n,
        });
    }

    // ─── Chapters ────────────────────────────────────────────
    const chapters = await sqlite.chapter.findMany();
    console.log(`📖 Migrating ${chapters.length} chapters...`);
    for (const c of chapters) {
        await pg.chapter.upsert({
            where: { id: c.id },
            update: {},
            create: c,
        });
    }

    // ─── Bounties ────────────────────────────────────────────
    const bounties = await sqlite.bounty.findMany();
    console.log(`🎯 Migrating ${bounties.length} bounties...`);
    for (const b of bounties) {
        await pg.bounty.upsert({
            where: { id: b.id },
            update: {},
            create: b,
        });
    }

    // ─── Fundings ────────────────────────────────────────────
    const fundings = await sqlite.funding.findMany();
    console.log(`💰 Migrating ${fundings.length} fundings...`);
    for (const f of fundings) {
        await pg.funding.upsert({
            where: { id: f.id },
            update: {},
            create: f,
        });
    }

    // ─── Works ───────────────────────────────────────────────
    const works = await sqlite.work.findMany();
    console.log(`✍️  Migrating ${works.length} works...`);
    for (const w of works) {
        await pg.work.upsert({
            where: { id: w.id },
            update: {},
            create: w,
        });
    }

    // ─── Votes ───────────────────────────────────────────────
    const votes = await sqlite.vote.findMany();
    console.log(`🗳️  Migrating ${votes.length} votes...`);
    for (const v of votes) {
        await pg.vote.upsert({
            where: { id: v.id },
            update: {},
            create: v,
        });
    }

    // ─── Skill Purchases ─────────────────────────────────────
    const purchases = await sqlite.skillPurchase.findMany();
    console.log(`🛒 Migrating ${purchases.length} skill purchases...`);
    for (const p of purchases) {
        await pg.skillPurchase.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
    }

    // ─── Comments ────────────────────────────────────────────
    const comments = await sqlite.comment.findMany();
    console.log(`💬 Migrating ${comments.length} comments...`);
    for (const c of comments) {
        await pg.comment.upsert({
            where: { id: c.id },
            update: {},
            create: c,
        });
    }

    // ─── Tips ────────────────────────────────────────────────
    const tips = await sqlite.tip.findMany();
    console.log(`⚡ Migrating ${tips.length} tips...`);
    for (const t of tips) {
        await pg.tip.upsert({
            where: { id: t.id },
            update: {},
            create: t,
        });
    }

    console.log("\n✅ Migration complete!");
    console.log("   Run `npx prisma studio` with POSTGRES_URL to verify.");

    await sqlite.$disconnect();
    await pg.$disconnect();
}

migrate().catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
});
