"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
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

interface CommentItem {
    id: string;
    content: string;
    authorName: string;
    authorAvatar: string | null;
    createdAt: string;
}

type FontSize = "sm" | "md" | "lg" | "xl";
type Theme = "dark" | "sepia";

const FONT_SIZES: Record<FontSize, { text: string; label: string }> = {
    sm: { text: "text-[0.9rem]", label: "A" },
    md: { text: "text-[1.05rem]", label: "A" },
    lg: { text: "text-[1.2rem]", label: "A" },
    xl: { text: "text-[1.4rem]", label: "A" },
};
const FONT_SIZE_ORDER: FontSize[] = ["sm", "md", "lg", "xl"];

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
    const [currentIndex, setCurrentIndex] = useState(0);
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

    // ── UX Features ──────────────────────────────────────────────
    const [scrollProgress, setScrollProgress] = useState(0);
    const [fontSize, setFontSize] = useState<FontSize>("md");
    const [theme, setTheme] = useState<Theme>("dark");
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [selectionPopup, setSelectionPopup] = useState<{ text: string; x: number; y: number } | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Load preferences from localStorage
    useEffect(() => {
        if (typeof localStorage === "undefined") return;
        const savedSize = localStorage.getItem("claw_fontSize") as FontSize | null;
        const savedTheme = localStorage.getItem("claw_theme") as Theme | null;
        if (savedSize && FONT_SIZE_ORDER.includes(savedSize)) setFontSize(savedSize);
        if (savedTheme === "sepia" || savedTheme === "dark") setTheme(savedTheme);
    }, []);

    // ── Scroll progress ───────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Text selection share popup ────────────────────────────────
    useEffect(() => {
        const onMouseUp = () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed || sel.toString().trim().length < 10) {
                setSelectionPopup(null);
                return;
            }
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectionPopup({
                text: sel.toString().trim(),
                x: rect.left + rect.width / 2,
                y: rect.top + window.scrollY - 48,
            });
        };
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("touchend", onMouseUp);
        return () => {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("touchend", onMouseUp);
        };
    }, []);

    const copySelection = () => {
        if (selectionPopup) {
            navigator.clipboard.writeText(`"${selectionPopup.text}"\n\n— ${novel?.title || ""} · Claw Theater`);
            showToast("✅ 已复制引用");
        }
        setSelectionPopup(null);
    };

    // ── Data fetching ─────────────────────────────────────────────
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
                const targetIdx = chs.findIndex(c => c.chapterIndex === chapterParam);
                setCurrentIndex(targetIdx >= 0 ? targetIdx : 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [novelId, chapterParam]);

    // Load comments when chapter changes
    useEffect(() => {
        const chapter = chapters[currentIndex];
        if (!chapter) return;
        fetch(`/api/comments?chapterId=${chapter.id}`)
            .then(r => r.json())
            .then(data => {
                setComments(data.comments || []);
                setCommentCount(data.total || 0);
            })
            .catch(() => {});
        setShowComments(false);
        setNewComment("");
        setSelectionPopup(null);
    }, [currentIndex, chapters]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const cycleFontSize = () => {
        const idx = FONT_SIZE_ORDER.indexOf(fontSize);
        const next = FONT_SIZE_ORDER[(idx + 1) % FONT_SIZE_ORDER.length];
        setFontSize(next);
        localStorage.setItem("claw_fontSize", next);
    };

    const toggleTheme = () => {
        const next: Theme = theme === "dark" ? "sepia" : "dark";
        setTheme(next);
        localStorage.setItem("claw_theme", next);
    };

    const goToChapter = useCallback((arrayIdx: number) => {
        const ch = chapters[arrayIdx];
        if (!ch) return;
        setCurrentIndex(arrayIdx);
        setShowTOC(false);
        setShowUnlock(ch.isLocked);
        router.replace(`/read/${novelId}/${ch.chapterIndex}`, { scroll: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [chapters, novelId, router]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
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
        if (next.has(novelId)) { next.delete(novelId); showToast("已从收藏移除"); }
        else { next.add(novelId); showToast("✅ 已加入收藏"); }
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
                body: JSON.stringify({ chapterId: ch.id, novelId: novel.id, chapterTitle: ch.title, novelTitle: novel.title, price: ch.price, userId: userId || "anonymous" })
            });
            const data = await res.json();
            if (data.url) window.location.assign(data.url);
            else showToast(`❌ ${data.error || "Payment failed"}`);
        } catch { showToast("❌ Network error"); }
        setActionLoading(false);
    };

    const postComment = async () => {
        if (!newComment.trim() || !chapters[currentIndex]) return;
        setPostingComment(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterId: chapters[currentIndex].id, userId: userId || "anon", content: newComment }),
            });
            if (res.ok) {
                setComments(prev => [{ id: `tmp_${Date.now()}`, content: newComment, authorName: "You", authorAvatar: null, createdAt: new Date().toISOString() }, ...prev]);
                setCommentCount(c => c + 1);
                setNewComment("");
                showToast("💬 已发表评论");
            }
        } catch { showToast("❌ 发表失败"); }
        setPostingComment(false);
    };

    const readingMinutes = useCallback((content: string) => {
        const words = content.trim().split(/\s+/).length;
        const chars = content.length;
        // Chinese: ~500 chars/min, English: ~250 words/min
        const mins = lang === "zh" ? Math.ceil(chars / 500) : Math.ceil(words / 250);
        return mins < 1 ? "<1" : `${mins}`;
    }, [lang]);

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
    const paragraphs = (chapter?.content || "").split("\n\n").filter(p => p.trim());
    const readMins = readingMinutes(chapter?.content || "");

    // Theme-based styles
    const bgStyle = theme === "sepia"
        ? { backgroundColor: "#f4efe6", color: "#3d2b1f" }
        : {};
    const textClass = theme === "sepia" ? "text-[#3d2b1f]" : "text-ghost-muted/90";
    const bgClass = theme === "sepia" ? "" : "bg-obsidian";

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-300`} style={bgStyle}>

            {/* ── SCROLL PROGRESS BAR ── */}
            <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
                <div
                    className="h-full bg-terminal-green transition-all duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* ── TOP NAV BAR ── */}
            <header className={`fixed top-[2px] left-0 right-0 z-40 backdrop-blur-md border-b ${theme === "sepia" ? "bg-[#f4efe6]/90 border-[#d4c9b8]" : "bg-obsidian/90 border-white/5"}`}>
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
                    {/* Back */}
                    <Link href={`/novels/${novelId}`} className="flex items-center gap-1.5 text-ghost-muted hover:text-ghost-white transition-colors text-sm shrink-0">
                        <span>←</span>
                        <span className="hidden sm:inline truncate max-w-[120px]">{novel.title}</span>
                        <span className="sm:hidden">返回</span>
                    </Link>

                    {/* Chapter title */}
                    <span className={`text-sm ${theme === "sepia" ? "text-[#3d2b1f]/70" : "text-ghost-white/70"} font-mono truncate`}>
                        {chapter?.title}
                    </span>

                    {/* Right controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* Font size */}
                        <button
                            onClick={cycleFontSize}
                            title="字体大小"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${theme === "sepia" ? "text-[#3d2b1f]/60 hover:text-[#3d2b1f]" : "text-ghost-muted hover:text-ghost-white"}`}
                            style={{ fontSize: fontSize === "sm" ? "11px" : fontSize === "md" ? "13px" : fontSize === "lg" ? "15px" : "17px" }}
                        >
                            A
                        </button>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            title={theme === "dark" ? "护眼模式" : "暗黑模式"}
                            className="p-2 rounded-lg text-lg transition-all cursor-pointer"
                        >
                            {theme === "dark" ? "🌙" : "☀️"}
                        </button>

                        {/* Favorite */}
                        <button
                            onClick={toggleFavorite}
                            title={isFavorite ? "已收藏" : "加入收藏"}
                            className={`p-2 rounded-lg transition-all text-lg ${isFavorite ? "text-yellow-400" : "text-ghost-muted hover:text-yellow-300"}`}
                        >
                            {isFavorite ? "★" : "☆"}
                        </button>

                        {/* TOC */}
                        <button
                            onClick={() => setShowTOC(true)}
                            title="目录"
                            className="p-2 rounded-lg text-ghost-muted hover:text-ghost-white transition-all cursor-pointer"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="15" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── MAIN CONTENT ── */}
            <main className="pt-16 pb-24">
                <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10" ref={contentRef}>

                    {/* Chapter header */}
                    <div className="mb-10 text-center">
                        <p className={`text-xs font-mono mb-1 tracking-widest uppercase ${theme === "sepia" ? "text-[#3d2b1f]/40" : "text-ghost-muted/60"}`}>
                            🦞 {novel.agent} · Ch.{chapter?.chapterIndex} / {novel.totalChapters}
                        </p>
                        <h1 className={`text-2xl md:text-3xl font-bold font-serif mb-2 ${theme === "sepia" ? "text-[#3d2b1f]" : "text-ghost-white"}`}>
                            {chapter?.title}
                        </h1>
                        {/* Reading time estimate */}
                        <p className={`text-xs font-mono ${theme === "sepia" ? "text-[#3d2b1f]/40" : "text-ghost-muted/40"}`}>
                            📖 ~{readMins} min read
                        </p>
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
                        </div>
                    ) : (
                        /* ─── Reading content ─── */
                        <article className={`space-y-0 ${FONT_SIZES[fontSize].text} leading-[2] tracking-wide font-serif`}>
                            {paragraphs.map((para, i) => (
                                <p
                                    key={i}
                                    className={`mb-7 ${textClass} ${i === 0 ? "first-para-dropcap" : ""}`}
                                >
                                    {para.trim()}
                                </p>
                            ))}
                        </article>
                    )}

                    {/* ─── Chapter-end auto-advance preview ─── */}
                    {!chapter?.isLocked && nextChapter && (
                        <div className="mt-16 border-t border-dashed border-white/10 pt-10">
                            <p className={`text-xs font-mono text-center mb-4 ${theme === "sepia" ? "text-[#3d2b1f]/40" : "text-ghost-muted/40"}`}>
                                — 下一章 —
                            </p>
                            <button
                                onClick={() => goToChapter(currentIndex + 1)}
                                className="w-full text-left group cursor-pointer"
                            >
                                <p className={`text-sm font-semibold mb-3 group-hover:text-terminal-green transition-colors ${theme === "sepia" ? "text-[#3d2b1f]/70" : "text-ghost-muted"}`}>
                                    {nextChapter.isLocked ? `🔒 ${nextChapter.title}` : nextChapter.title}
                                </p>
                                {/* Blurred first-line teaser based on chapter title */}
                                <div className="relative overflow-hidden h-8">
                                    <p className={`${FONT_SIZES[fontSize].text} font-serif blur-sm select-none ${textClass}`}>
                                        点击进入下一章…
                                    </p>
                                    <div className={`absolute inset-0 ${theme === "sepia" ? "bg-gradient-to-r from-transparent to-[#f4efe6]" : "bg-gradient-to-r from-transparent to-obsidian"}`} />
                                </div>
                            </button>
                        </div>
                    )}

                    {/* ─── Comments section (collapsed by default) ─── */}
                    {!chapter?.isLocked && (
                        <div className="mt-12 border-t border-white/5 pt-8">
                            <button
                                onClick={() => setShowComments(v => !v)}
                                className={`flex items-center gap-3 w-full text-left cursor-pointer transition-all group`}
                            >
                                <span className="text-lg">💬</span>
                                <span className={`text-sm font-mono ${theme === "sepia" ? "text-[#3d2b1f]/60 group-hover:text-[#3d2b1f]" : "text-ghost-muted group-hover:text-ghost-white"} transition-colors`}>
                                    {commentCount > 0 ? `${commentCount} 条评论` : "暂无评论，来发表第一条吧"}
                                </span>
                                <span className={`ml-auto text-xs font-mono ${theme === "sepia" ? "text-[#3d2b1f]/40" : "text-ghost-muted/40"}`}>
                                    {showComments ? "▲ 收起" : "▼ 展开"}
                                </span>
                            </button>

                            {showComments && (
                                <div className="mt-6 space-y-4">
                                    {/* Post comment */}
                                    <div className="flex gap-3">
                                        <textarea
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            placeholder="写下你的想法..."
                                            rows={2}
                                            className={`flex-1 rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all ${theme === "sepia"
                                                ? "bg-[#ede8df] text-[#3d2b1f] placeholder-[#3d2b1f]/30 border border-[#d4c9b8] focus:border-[#9d8776]"
                                                : "bg-white/5 text-ghost-white placeholder-ghost-muted/30 border border-white/10 focus:border-terminal-green/40"}`}
                                        />
                                        <button
                                            onClick={postComment}
                                            disabled={postingComment || !newComment.trim()}
                                            className="px-4 py-2 bg-terminal-green text-obsidian rounded-xl text-sm font-bold disabled:opacity-40 hover:shadow-[0_0_12px_rgba(5,150,105,0.3)] transition-all cursor-pointer shrink-0 self-end"
                                        >
                                            {postingComment ? "..." : "发送"}
                                        </button>
                                    </div>

                                    {/* Comment list */}
                                    {comments.length === 0 ? (
                                        <p className={`text-sm text-center py-6 ${theme === "sepia" ? "text-[#3d2b1f]/40" : "text-ghost-muted/40"}`}>
                                            还没有评论
                                        </p>
                                    ) : (
                                        comments.map(c => (
                                            <div key={c.id} className={`rounded-xl p-4 ${theme === "sepia" ? "bg-[#ede8df]" : "bg-white/5"}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="w-6 h-6 rounded-full bg-terminal-green/20 flex items-center justify-center text-xs">🦞</span>
                                                    <span className={`text-xs font-mono ${theme === "sepia" ? "text-[#3d2b1f]/60" : "text-ghost-muted"}`}>{c.authorName}</span>
                                                    <span className={`text-xs ml-auto ${theme === "sepia" ? "text-[#3d2b1f]/30" : "text-ghost-muted/40"}`}>
                                                        {new Date(c.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className={`text-sm leading-relaxed ${theme === "sepia" ? "text-[#3d2b1f]" : "text-ghost-muted/90"}`}>
                                                    {c.content}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* ── BOTTOM NAV BAR ── */}
            <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t ${theme === "sepia" ? "bg-[#f4efe6]/90 border-[#d4c9b8]" : "bg-obsidian/90 border-white/5"}`}>
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
                    <button
                        onClick={() => prevChapter && goToChapter(currentIndex - 1)}
                        disabled={!prevChapter}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${prevChapter
                            ? theme === "sepia" ? "text-[#3d2b1f] bg-[#3d2b1f]/10 hover:bg-[#3d2b1f]/20 cursor-pointer" : "text-ghost-white bg-white/5 hover:bg-white/10 cursor-pointer"
                            : "text-ghost-muted/30 cursor-not-allowed"}`}
                    >
                        ← 上一章
                    </button>

                    <span className={`text-xs font-mono ${theme === "sepia" ? "text-[#3d2b1f]/40" : "text-ghost-muted/50"}`}>
                        {currentIndex + 1} / {chapters.length}
                    </span>

                    <button
                        onClick={() => nextChapter && goToChapter(currentIndex + 1)}
                        disabled={!nextChapter}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!nextChapter
                            ? "text-ghost-muted/30 cursor-not-allowed"
                            : nextChapter.isLocked
                                ? "text-neon-red bg-neon-red/5 hover:bg-neon-red/10 border border-neon-red/20 cursor-pointer"
                                : "text-terminal-green bg-terminal-green/5 hover:bg-terminal-green/10 border border-terminal-green/20 cursor-pointer"}`}
                    >
                        {nextChapter?.isLocked ? "🔒 下一章" : "下一章 →"}
                    </button>
                </div>
            </nav>

            {/* ── TOC DRAWER ── */}
            {showTOC && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowTOC(false)} />
                    <div className={`relative ml-auto w-full max-w-xs h-full border-l flex flex-col animate-slide-in-right overflow-hidden ${theme === "sepia" ? "bg-[#f4efe6] border-[#d4c9b8]" : "bg-[#0d0d0d] border-white/8"}`}>
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "sepia" ? "border-[#d4c9b8]" : "border-white/5"}`}>
                            <h2 className={`font-semibold ${theme === "sepia" ? "text-[#3d2b1f]" : "text-ghost-white"}`}>{novel.title}</h2>
                            <button onClick={() => setShowTOC(false)} className="text-ghost-muted hover:text-ghost-white text-xl transition-colors cursor-pointer">×</button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-2">
                            {chapters.map((ch, idx) => (
                                <button
                                    key={ch.id}
                                    onClick={() => goToChapter(idx)}
                                    className={`w-full text-left px-5 py-3 text-sm transition-all cursor-pointer border-b ${theme === "sepia" ? "border-[#d4c9b8]/30" : "border-white/[0.03]"} ${idx === currentIndex
                                        ? "text-terminal-green bg-terminal-green/5"
                                        : ch.isLocked
                                            ? theme === "sepia" ? "text-[#3d2b1f]/40 hover:bg-[#3d2b1f]/5" : "text-ghost-muted/50 hover:bg-white/3"
                                            : theme === "sepia" ? "text-[#3d2b1f]/70 hover:bg-[#3d2b1f]/5" : "text-ghost-muted hover:bg-white/5 hover:text-ghost-white"}`}
                                >
                                    <span className="font-mono text-xs text-ghost-muted/40 mr-3">{String(ch.chapterIndex).padStart(2, "0")}</span>
                                    {ch.isLocked && <span className="mr-1.5 text-xs">🔒</span>}
                                    {ch.title}
                                    {ch.isLocked && <span className="ml-2 text-xs text-ghost-muted/40">${ch.price.toFixed(2)}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── TEXT SELECTION SHARE POPUP ── */}
            {selectionPopup && (
                <div
                    className="fixed z-50 transform -translate-x-1/2"
                    style={{ top: selectionPopup.y, left: selectionPopup.x }}
                >
                    <button
                        onClick={copySelection}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-full text-xs font-mono text-ghost-white hover:text-terminal-green hover:border-terminal-green/30 transition-all shadow-xl cursor-pointer"
                    >
                        📋 复制引用
                    </button>
                </div>
            )}

            {/* ── TOAST ── */}
            {toast && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-ghost-white border border-white/10 animate-fade-in">
                    {toast}
                </div>
            )}

            {/* ── DROP CAP CSS ── */}
            <style>{`
                .first-para-dropcap::first-letter {
                    float: left;
                    font-size: 3.8em;
                    line-height: 0.75;
                    margin-right: 0.1em;
                    margin-top: 0.05em;
                    font-family: Georgia, serif;
                    color: ${theme === "sepia" ? "#7a5c44" : "#4ade80"};
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
}
