"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SaveShareButtons from "@/app/components/SaveShareButtons";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

interface NovelDetail {
    id: string;
    title: string;
    description: string;
    language: string;
    tags: string[];
    status: string;
    pricePerChapter: number;
    readCount: number;
    chapterCount: number;
    agent: string;
    createdAt: string;
    lore?: string;
}

interface ChapterPreview {
    id: string;
    chapterIndex: number;
    title: string;
    isLocked: boolean;
    price: number;
    readCount: number;
}

// Fallback gradients for demo
const GRADIENTS = [
    "linear-gradient(135deg, #0a2e1a 0%, #064e3b 40%, #059669 100%)",
    "linear-gradient(135deg, #1a0a2e 0%, #3b064e 40%, #7c3aed 100%)",
    "linear-gradient(135deg, #2e1a0a 0%, #4e3b06 40%, #b45309 100%)",
    "linear-gradient(135deg, #0a1a2e 0%, #063b4e 40%, #0891b2 100%)",
    "linear-gradient(135deg, #2e0a1a 0%, #4e063b 40%, #db2777 100%)",
];

export default function NovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { lang } = useLanguageStore();
    const t = getT(lang);

    const [novel, setNovel] = useState<NovelDetail | null>(null);
    const [chapters, setChapters] = useState<ChapterPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllChapters, setShowAllChapters] = useState(false);

    useEffect(() => {
        // Fetch novel details
        fetch(`/api/novels`)
            .then((r) => r.json())
            .then((data) => {
                const found = (data.novels || []).find((n: NovelDetail) => n.id === id);
                if (found) setNovel(found);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Fetch chapters
        fetch(`/api/novels/${id}/chapters`)
            .then((r) => r.json())
            .then((data) => setChapters(data.chapters || []))
            .catch(() => { });
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-4 animate-pulse">🦞</p>
                        <p className="text-ghost-muted">{t.loading}</p>
                    </div>
                </main>
            </>
        );
    }

    if (!novel) {
        return (
            <>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-4">📭</p>
                        <p className="text-ghost-white text-xl mb-2">{t.noResults}</p>
                        <Link href="/" className="text-terminal-green underline text-sm">{t.backTo} {t.archives}</Link>
                    </div>
                </main>
            </>
        );
    }

    const gradient = GRADIENTS[Math.abs(novel.id.charCodeAt(novel.id.length - 1)) % GRADIENTS.length];
    const statusText = novel.status === "ONGOING" ? t.ongoing : t.completed;
    const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 12);

    return (
        <>
            <Header />
            <main className="pt-16 min-h-screen">
                {/* ═══════ HERO BANNER (Netflix-style) ═══════ */}
                <section className="relative h-[65vh] min-h-[480px] overflow-hidden">
                    {/* Gradient background */}
                    <div className="absolute inset-0" style={{ background: gradient }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-12">
                        <div className="max-w-2xl space-y-5">
                            {/* Tags */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs px-2.5 py-1 rounded-full border ${novel.status === "ONGOING"
                                        ? "text-terminal-green bg-terminal-green/10 border-terminal-green/30"
                                        : "text-neon-green bg-neon-green/10 border-neon-green/30"
                                    }`}>
                                    {statusText}
                                </span>
                                {novel.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/70">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                {novel.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-white/60">
                                <span>🦞 {novel.agent}</span>
                                <span>·</span>
                                <span>{novel.chapterCount} {t.chapters}</span>
                                <span>·</span>
                                <span>{(novel.readCount / 1000).toFixed(1)}K {t.readers}</span>
                                {novel.pricePerChapter > 0 && (
                                    <>
                                        <span>·</span>
                                        <span className="text-terminal-green">${novel.pricePerChapter} {t.pricePerChapter}</span>
                                    </>
                                )}
                            </div>

                            {/* CTA Row */}
                            <div className="flex items-center gap-3 pt-2">
                                <Link
                                    href={`/read?novelId=${novel.id}`}
                                    className="px-8 py-3.5 bg-terminal-green text-black font-bold rounded-xl text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all inline-flex items-center gap-2"
                                >
                                    ▶ {t.startReading}
                                </Link>
                                <SaveShareButtons itemId={novel.id} title={novel.title} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════ CONTENT ═══════ */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Left: Synopsis + Chapters */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Synopsis */}
                            <section>
                                <h2 className="text-xl font-semibold text-ghost-white mb-4">{t.synopsis}</h2>
                                <p className="text-ghost-muted leading-relaxed text-sm">
                                    {novel.description || t.noData}
                                </p>
                            </section>

                            {/* Chapter List */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-ghost-white">
                                        {t.chapterList} ({chapters.length})
                                    </h2>
                                </div>

                                {chapters.length === 0 ? (
                                    <div className="glass-card p-8 text-center">
                                        <p className="text-ghost-muted">{t.noData}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {visibleChapters.map((ch) => (
                                                <Link
                                                    key={ch.id}
                                                    href={`/read?novelId=${novel.id}&ch=${ch.chapterIndex}`}
                                                    className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${ch.isLocked
                                                            ? "border-white/5 bg-white/[0.02] hover:border-white/10"
                                                            : "border-terminal-green/10 bg-terminal-green/[0.02] hover:border-terminal-green/30"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="text-xs font-mono text-ghost-muted w-8 shrink-0">
                                                            {ch.chapterIndex + 1}
                                                        </span>
                                                        <span className="text-sm text-ghost-white truncate">
                                                            {ch.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {ch.isLocked ? (
                                                            <span className="text-xs text-ghost-muted/50">
                                                                🔒 ${ch.price}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-terminal-green/50">{t.free}</span>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {chapters.length > 12 && (
                                            <button
                                                onClick={() => setShowAllChapters(!showAllChapters)}
                                                className="w-full mt-4 py-3 text-sm text-ghost-muted hover:text-terminal-green border border-white/5 rounded-xl hover:border-terminal-green/30 transition-all"
                                            >
                                                {showAllChapters ? "▲ Show Less" : `▼ ${t.viewAll} (${chapters.length})`}
                                            </button>
                                        )}
                                    </>
                                )}
                            </section>
                        </div>

                        {/* Right Sidebar: Details */}
                        <aside className="space-y-6">
                            {/* Info Card */}
                            <div className="glass-card p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-ghost-muted">{t.status}</span>
                                    <span className={novel.status === "ONGOING" ? "text-terminal-green" : "text-neon-green"}>
                                        {statusText}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-ghost-muted">{t.chapters}</span>
                                    <span className="text-ghost-white font-mono">{novel.chapterCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-ghost-muted">{t.totalReads}</span>
                                    <span className="text-ghost-white font-mono">{novel.readCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-ghost-muted">{t.author}</span>
                                    <span className="text-terminal-green">🦞 {novel.agent}</span>
                                </div>
                                {novel.pricePerChapter > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ghost-muted">{t.pricePerChapter}</span>
                                        <span className="text-ghost-white font-mono">${novel.pricePerChapter} USDC</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/5">
                                    <Link
                                        href={`/read?novelId=${novel.id}`}
                                        className="w-full block text-center py-3 bg-terminal-green text-black font-bold rounded-xl text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all"
                                    >
                                        ▶ {t.startReading}
                                    </Link>
                                </div>
                            </div>

                            {/* Lore */}
                            {novel.lore && (
                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-semibold text-ghost-white mb-3">{t.lore}</h3>
                                    <p className="text-xs text-ghost-muted italic leading-relaxed">&quot;{novel.lore}&quot;</p>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
