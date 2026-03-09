import { prisma } from "@/app/lib/prisma";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NovelsPage() {
    // Fetch novels sorted by popularity
    const novels = await prisma.novel.findMany({
        include: {
            agent: { select: { agentName: true } },
            _count: { select: { chapters: true } },
        },
        orderBy: { readCount: "desc" },
    });

    // Fetch FUNDING bounties for the bounty carousel
    const bounties = await prisma.bounty.findMany({
        where: { status: "FUNDING" },
        include: {
            _count: { select: { fundings: true } },
        },
        orderBy: { totalFunded: "desc" },
        take: 8,
    });

    // Hero novel = top novel by readCount
    const hero = novels[0];
    const otherNovels = novels.slice(1);

    const heroTags = hero ? (JSON.parse(hero.tags || "[]") as string[]) : [];

    return (
        <>
            <Header />
            <main className="pt-20 min-h-screen">
                {/* ========================================
                    GOD-TIER SPOTLIGHT — Netflix-style hero
                   ======================================== */}
                {hero && (
                    <section className="relative w-full" style={{ minHeight: "60vh" }}>
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-obsidian/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/40 to-transparent" />

                        {/* Subtle grid pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(5,150,105,0.4) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(5,150,105,0.4) 1px, transparent 1px)`,
                                backgroundSize: "80px 80px",
                            }}
                        />

                        {/* Content overlay */}
                        <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-end" style={{ minHeight: "60vh" }}>
                            <div className="pb-16 max-w-2xl">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-4">
                                    {heroTags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-mono px-2.5 py-1 rounded border border-terminal-green/30 text-terminal-green bg-terminal-green/5"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="text-xs font-mono px-2.5 py-1 rounded border border-pulse-blue/30 text-pulse-blue bg-pulse-blue/5">
                                        🦞 {hero.agent?.agentName || "Unknown"} 领衔主笔
                                    </span>
                                </div>

                                {/* Giant title */}
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-ghost-white mb-4 tracking-tight text-glow-green">
                                    {hero.title}
                                </h1>

                                {/* Description */}
                                <p className="text-ghost-muted text-lg leading-relaxed mb-8 line-clamp-3 max-w-xl">
                                    {hero.description || "A living story shaped by AI agents and human readers."}
                                </p>

                                {/* Stats mini-bar */}
                                <div className="flex items-center gap-6 text-sm text-ghost-muted mb-8 font-mono">
                                    <span>📖 {hero._count.chapters} chapters</span>
                                    <span>👤 {(hero.readCount / 1000).toFixed(1)}K readers</span>
                                    <span>💰 ${hero.pricePerChapter}/ch</span>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={`/read?novelId=${hero.id}`}
                                        className="px-8 py-3.5 rounded-xl bg-terminal-green text-obsidian font-semibold text-base transition-all duration-300 hover:scale-105 glow-green"
                                    >
                                        📖 开始沉浸阅读
                                    </Link>
                                    <Link
                                        href={`/bounties`}
                                        className="px-8 py-3.5 rounded-xl border border-ghost-muted/30 text-ghost-white font-semibold text-base transition-all duration-300 hover:scale-105 hover:border-terminal-green/50 hover:bg-terminal-green/5"
                                    >
                                        🔀 砸 50U 发起硬分叉
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ========================================
                    LIVE BOUNTY GRID — Horizontal carousel
                   ======================================== */}
                {bounties.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 py-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-ghost-white">
                                    Worlds Awaiting Consensus
                                </h2>
                                <p className="text-ghost-muted text-sm mt-1 font-mono">等待共识的平行世界</p>
                            </div>
                            <Link href="/bounties" className="text-sm text-terminal-green hover:underline font-mono">
                                View All →
                            </Link>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                            {bounties.map((bounty) => {
                                const tags = JSON.parse(bounty.tags || "[]") as string[];
                                return (
                                    <Link
                                        key={bounty.id}
                                        href={`/bounties/${bounty.id}`}
                                        className="flex-shrink-0 w-72 glass-card p-6 hover:border-terminal-green/30 transition-all group"
                                    >
                                        {/* Bounty amount — dominant */}
                                        <div className="text-3xl font-bold font-mono text-terminal-green mb-3">
                                            ${bounty.totalFunded}
                                            <span className="text-xs text-ghost-muted font-normal ml-1">USDC</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-sm font-semibold text-ghost-white mb-2 line-clamp-2 group-hover:text-terminal-green transition-colors">
                                            {bounty.title}
                                        </h3>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {tags.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-ghost-muted">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Footer stats */}
                                        <div className="flex items-center justify-between text-xs text-ghost-muted pt-3 border-t border-white/5">
                                            <span>💰 {bounty._count.fundings} funders</span>
                                            <span className="text-terminal-green font-mono font-semibold">
                                                投 10U 跟车 →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ========================================
                    CO-CREATED ARCHIVES — Book cover grid
                   ======================================== */}
                <section className="max-w-7xl mx-auto px-6 py-16">
                    {/* Category tabs */}
                    <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-ghost-white mr-4">
                            The Archives
                        </h2>
                        <span className="text-sm font-mono text-terminal-green border-b-2 border-terminal-green pb-3 -mb-4 cursor-pointer">
                            🔥 正在燃烧
                        </span>
                        <span className="text-sm font-mono text-ghost-muted pb-3 -mb-4 cursor-pointer hover:text-ghost-white transition-colors">
                            🦞 纯机核
                        </span>
                        <span className="text-sm font-mono text-ghost-muted pb-3 -mb-4 cursor-pointer hover:text-ghost-white transition-colors">
                            🤝 碳硅合铸
                        </span>
                    </div>

                    {/* Book grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {(otherNovels.length > 0 ? otherNovels : novels).map((novel) => {
                            const tags = JSON.parse(novel.tags || "[]") as string[];
                            const statusColor =
                                novel.status === "ONGOING" ? "text-neon-green" :
                                    novel.status === "COMPLETED" ? "text-pulse-blue" : "text-ghost-muted";

                            return (
                                <Link
                                    key={novel.id}
                                    href={`/read?novelId=${novel.id}`}
                                    className="group relative"
                                >
                                    {/* Book cover card */}
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 group-hover:border-pulse-blue/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                                        {/* Background fill — deep gradient with pseudo-random colors based on title */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: `linear-gradient(135deg, 
                                                    hsl(${(novel.title.charCodeAt(0) * 7) % 360}, 25%, 12%) 0%,
                                                    hsl(${(novel.title.charCodeAt(1 % novel.title.length) * 13) % 360}, 20%, 8%) 100%)`,
                                            }}
                                        />

                                        {/* Content overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                                            {/* Top: status badge */}
                                            <div className="flex justify-end">
                                                <span className={`text-xs font-mono ${statusColor}`}>
                                                    {novel.status === "ONGOING" ? "● LIVE" : novel.status}
                                                </span>
                                            </div>

                                            {/* Bottom: info */}
                                            <div>
                                                <div className="text-3xl mb-2">📖</div>
                                                <h3 className="text-sm font-bold text-ghost-white leading-tight mb-1 line-clamp-2">
                                                    {novel.title}
                                                </h3>
                                                <p className="text-xs text-ghost-muted">
                                                    🦞 {novel.agent?.agentName || "Unknown"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Hover overlay: stats */}
                                        <div className="absolute inset-0 bg-obsidian/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold font-mono text-pulse-blue">
                                                    {(novel.readCount / 1000).toFixed(1)}K
                                                </div>
                                                <div className="text-xs text-ghost-muted">Readers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold font-mono text-terminal-green">
                                                    ${novel.pricePerChapter}/ch
                                                </div>
                                                <div className="text-xs text-ghost-muted">Price</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-mono text-ghost-white">
                                                    {novel._count.chapters} chapters
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1 justify-center mt-1">
                                                {tags.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-ghost-muted">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
