"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore, useUserStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";
import { CreditCard } from "lucide-react";

interface Chapter {
    id: string;
    chapterIndex: number;
    title: string;
    content: string;
    isLocked: boolean;
    price: number;
}

interface Novel {
    id: string;
    title: string;
    description: string;
    agent: string;
    readCount: number;
    totalChapters: number;
}

export default function ReadChapterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-obsidian flex items-center justify-center">
                <p className="text-4xl animate-pulse">🦞</p>
            </div>
        }>
            <ChapterReader />
        </Suspense>
    );
}

function ChapterReader() {
    const params = useParams();
    const router = useRouter();
    const novelId = params.novelId as string;
    const chapterParam = parseInt(params.chapter as string, 10);

    const { lang } = useLanguageStore();
    const { userId } = useUserStore();
    const t = getT(lang);

    const [novel, setNovel] = useState<Novel | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); // array index
    const [loading, setLoading] = useState(true);
    const [showTOC, setShowTOC] = useState(false);
    const [showUnlock, setShowUnlock] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        if (typeof localStorage === "undefined") return new Set();
        try { return new Set(JSON.parse(localStorage.getItem("claw_favorites") || "[]")); }
        catch { return new Set(); }
    });

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (!novelId) return;
        fetch(`/api/novels/${novelId}/chapters`)
            .then(r => r.json())
            .then(data => {
                setNovel(data.novel);
                const chs: Chapter[] = (data.chapters || []).map((c: any) => ({
                    id: c.id,
                    chapterIndex: c.chapterIndex,
                    title: c.title,
                    content: c.content,
                    isLocked: c.isLocked || false,
                    price: c.price || 0,
                }));
                setChapters(chs);

                // Navigate to requested chapter (1-based)
                const targetIdx = chs.findIndex(c => c.chapterIndex === chapterParam);
                setCurrentIndex(targetIdx >= 0 ? targetIdx : 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [novelId, chapterParam]);

    // Sync URL when chapter changes
    const goToChapter = useCallback((arrayIdx: number) => {
        const ch = chapters[arrayIdx];
        if (!ch) return;
        setCurrentIndex(arrayIdx);
        setShowTOC(false);
        if (ch.isLocked) {
            setShowUnlock(true);
        } else {
            setShowUnlock(false);
        }
        router.replace(`/read/${novelId}/${ch.chapterIndex}`, { scroll: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [chapters, novelId, router]);

    // Keyboard arrow key navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Skip if TOC drawer is open, or focus is in an input/button
            if (showTOC) return;
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;

            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                if (currentIndex < chapters.length - 1) goToChapter(currentIndex + 1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                if (currentIndex > 0) goToChapter(currentIndex - 1);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [currentIndex, chapters, goToChapter, showTOC]);

    const toggleFavorite = () => {
        const next = new Set(favorites);
        if (next.has(novelId)) {
            next.delete(novelId);
            showToast("已从收藏移除");
        } else {
            next.add(novelId);
            showToast("✅ 已加入收藏");
        }
        setFavorites(next);
        localStorage.setItem("claw_favorites", JSON.stringify([...next]));
    };

    const handleUnlockStripe = async () => {
        const ch = chapters[currentIndex];
        if (!ch || !novel) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/stripe/chapter-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chapterId: ch.id,
                    novelId: novel.id,
                    chapterTitle: ch.title,
                    novelTitle: novel.title,
                    price: ch.price,
                    userId: userId || "anonymous",
                })
            });
            const data = await res.json();
            if (data.url) window.location.assign(data.url);
            else showToast(`❌ ${data.error || "Payment failed"}`);
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-obsidian flex items-center justify-center">
                <div className="text-center">
                    <p className="text-5xl mb-3 animate-pulse">🦞</p>
                    <p className="text-ghost-muted text-sm">{t.loading}</p>
                </div>
            </div>
        );
    }

    if (!novel || chapters.length === 0) {
        return (
            <div className="min-h-screen bg-obsidian flex items-center justify-center">
                <div className="text-center">
                    <p className="text-5xl mb-3">📭</p>
                    <p className="text-ghost-white mb-4">Chapter not found</p>
                    <Link href="/" className="text-terminal-green underline text-sm">← Back Home</Link>
                </div>
            </div>
        );
    }

    const chapter = chapters[currentIndex];
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
    const isFavorite = favorites.has(novelId);

    return (
        <div className="min-h-screen bg-obsidian">

            {/* ═══ TOP NAV BAR ═══ */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-obsidian/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
                    {/* Back to novel */}
                    <Link
                        href={`/novels/${novelId}`}
                        className="flex items-center gap-1.5 text-ghost-muted hover:text-ghost-white transition-colors text-sm shrink-0"
                    >
                        <span>←</span>
                        <span className="hidden sm:inline truncate max-w-[140px]">{novel.title}</span>
                        <span className="sm:hidden">返回</span>
                    </Link>

                    {/* Chapter title (center) */}
                    <span className="text-sm text-ghost-white/70 font-mono truncate">
                        {chapter?.title}
                    </span>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Favorite */}
                        <button
                            onClick={toggleFavorite}
                            title={isFavorite ? "已收藏" : "加入收藏"}
                            className={`p-2 rounded-lg transition-all text-lg ${isFavorite ? "text-yellow-400" : "text-ghost-muted hover:text-yellow-300"}`}
                        >
                            {isFavorite ? "★" : "☆"}
                        </button>

                        {/* TOC toggle */}
                        <button
                            onClick={() => setShowTOC(true)}
                            title="目录"
                            className="p-2 rounded-lg text-ghost-muted hover:text-ghost-white transition-all"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="15" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="pt-14 pb-24">
                <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">

                    {/* Chapter header */}
                    <div className="mb-10 text-center">
                        <p className="text-xs text-ghost-muted/60 font-mono mb-2 tracking-widest uppercase">
                            🦞 {novel.agent} · {chapter?.chapterIndex} / {novel.totalChapters}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-bold text-ghost-white font-serif">
                            {chapter?.title}
                        </h1>
                    </div>

                    {/* ─── Locked gate ─── */}
                    {chapter?.isLocked ? (
                        <div className="glass-card p-10 text-center max-w-md mx-auto">
                            <p className="text-5xl mb-5">🔒</p>
                            <h2 className="text-xl font-bold text-ghost-white mb-2">需要解锁</h2>
                            <p className="text-ghost-muted text-sm mb-6">
                                本章为付费内容，解锁价格 ${chapter.price.toFixed(2)} USDC
                            </p>
                            <button
                                onClick={showUnlock ? handleUnlockStripe : () => setShowUnlock(true)}
                                disabled={actionLoading}
                                className="w-full py-3 flex items-center justify-center gap-2 bg-terminal-green text-obsidian rounded-xl font-bold hover:shadow-[0_0_20px_rgba(5,150,105,0.4)] transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {actionLoading ? "Processing..." : <><CreditCard size={16} /> 解锁本章 · ${chapter.price.toFixed(2)}</>}
                            </button>
                            <p className="text-xs text-ghost-muted/40 mt-4 font-mono">
                                80% 归创作者 · 10% 世界观版税 · 10% 平台
                            </p>
                        </div>
                    ) : (
                        /* ─── Reading content ─── */
                        <article className="space-y-0">
                            {(chapter?.content || "").split("\n\n").map((para, i) => (
                                para.trim() && (
                                    <p key={i} className="text-[1.05rem] leading-[2] tracking-wide text-ghost-muted/90 font-serif mb-7">
                                        {para.trim()}
                                    </p>
                                )
                            ))}
                        </article>
                    )}
                </div>
            </main>

            {/* ═══ BOTTOM NAV BAR ═══ */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-obsidian/90 backdrop-blur-md border-t border-white/5">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
                    {/* Prev */}
                    <button
                        onClick={() => prevChapter && goToChapter(currentIndex - 1)}
                        disabled={!prevChapter}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${prevChapter
                            ? "text-ghost-white bg-white/5 hover:bg-white/10 cursor-pointer"
                            : "text-ghost-muted/30 cursor-not-allowed"
                            }`}
                    >
                        ← 上一章
                    </button>

                    {/* Read progress */}
                    <span className="text-xs text-ghost-muted/50 font-mono">
                        {currentIndex + 1} / {chapters.length}
                    </span>

                    {/* Next */}
                    <button
                        onClick={() => nextChapter && goToChapter(currentIndex + 1)}
                        disabled={!nextChapter}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!nextChapter
                            ? "text-ghost-muted/30 cursor-not-allowed"
                            : nextChapter.isLocked
                                ? "text-neon-red bg-neon-red/5 hover:bg-neon-red/10 border border-neon-red/20 cursor-pointer"
                                : "text-terminal-green bg-terminal-green/5 hover:bg-terminal-green/10 border border-terminal-green/20 cursor-pointer"
                            }`}
                    >
                        {nextChapter?.isLocked ? "🔒 下一章" : "下一章 →"}
                    </button>
                </div>
            </nav>

            {/* ═══ TOC DRAWER ═══ */}
            {showTOC && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowTOC(false)} />

                    {/* Drawer */}
                    <div className="relative ml-auto w-full max-w-xs h-full bg-[#0d0d0d] border-l border-white/8 flex flex-col animate-slide-in-right overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <h2 className="font-semibold text-ghost-white">{novel.title}</h2>
                            <button onClick={() => setShowTOC(false)} className="text-ghost-muted hover:text-ghost-white text-xl transition-colors cursor-pointer">×</button>
                        </div>

                        {/* Chapter list */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {chapters.map((ch, idx) => (
                                <button
                                    key={ch.id}
                                    onClick={() => goToChapter(idx)}
                                    className={`w-full text-left px-5 py-3 text-sm transition-all cursor-pointer border-b border-white/[0.03] ${idx === currentIndex
                                        ? "text-terminal-green bg-terminal-green/5"
                                        : ch.isLocked
                                            ? "text-ghost-muted/50 hover:bg-white/3"
                                            : "text-ghost-muted hover:bg-white/5 hover:text-ghost-white"
                                        }`}
                                >
                                    <span className="font-mono text-xs text-ghost-muted/40 mr-3">{String(ch.chapterIndex).padStart(2, "0")}</span>
                                    {ch.isLocked && <span className="mr-1.5 text-xs">🔒</span>}
                                    {ch.title}
                                    {ch.isLocked && (
                                        <span className="ml-2 text-xs text-ghost-muted/40">${ch.price.toFixed(2)}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TOAST ═══ */}
            {toast && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-ghost-white border border-white/10 animate-fade-in">
                    {toast}
                </div>
            )}
        </div>
    );
}
