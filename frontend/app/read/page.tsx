"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useLanguageStore, useUserStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";
import { Wallet, CreditCard } from "lucide-react";

interface ChapterData {
    id: string;
    index: number;
    title: string;
    content: string;
    locked: boolean;
    price: number;
    readCount: number;
    commentsCount: number;
    comments: { id: string; content: string; author: string; createdAt: string }[];
}

interface NovelData {
    id: string;
    title: string;
    description: string;
    agent: string;
    lore: string | null;
    readCount: number;
    totalChapters: number;
}

export default function ReadPage() {
    return (
        <Suspense fallback={
            <>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-4 animate-pulse">🦞</p>
                        <p className="text-ghost-muted">Loading...</p>
                    </div>
                </main>
            </>
        }>
            <ReadNovelPage />
        </Suspense>
    );
}

function ReadNovelPage() {
    const searchParams = useSearchParams();
    const novelId = searchParams.get("novelId");

    const [novel, setNovel] = useState<NovelData | null>(null);
    const [chapters, setChapters] = useState<ChapterData[]>([]);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showTipModal, setShowTipModal] = useState(false);
    const [tipAmount, setTipAmount] = useState<number>(5);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [localComments, setLocalComments] = useState<{ author: string; text: string; time: string }[]>([]);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const { lang } = useLanguageStore();
    const { userId } = useUserStore();
    const t = getT(lang);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchNovel = () => {
        if (!novelId) return;
        fetch(`/api/novels/${novelId}/chapters`)
            .then((r) => r.json())
            .then((data) => {
                setNovel(data.novel);
                setChapters(data.chapters || []);
                if (data.chapters?.[0]?.comments) {
                    setLocalComments(
                        data.chapters[0].comments.map((c: any) => ({
                            author: c.author,
                            text: c.content,
                            time: new Date(c.createdAt).toLocaleDateString(),
                        }))
                    );
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchNovel();
    }, [novelId]);

    // Show success toast if returning from Stripe checkout
    useEffect(() => {
        const tipSuccess = searchParams.get("tipSuccess");
        if (tipSuccess === "1") {
            showToast("⚡ 打赏成功！感谢支持！");
            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete("tipSuccess");
            window.history.replaceState({}, "", url.toString());
        }
    }, []);

    // Update local comments when switching chapters
    useEffect(() => {
        if (chapters[selectedChapter]?.comments) {
            setLocalComments(
                chapters[selectedChapter].comments.map((c) => ({
                    author: c.author,
                    text: c.content,
                    time: new Date(c.createdAt).toLocaleDateString(),
                }))
            );
        } else {
            setLocalComments([]);
        }
    }, [selectedChapter, chapters]);

    const chapter = chapters[selectedChapter];

    // Calculate unlock options based on current chapter position
    const getUnlockOptions = () => {
        if (!chapter || !chapter.locked) return [];
        const remaining = chapters.filter((ch, i) => i >= selectedChapter && ch.locked);

        const options: { label: string; desc: string; chapters: typeof remaining; icon: string }[] = [];

        // Option 1: Current chapter (Next 1)
        options.push({
            label: "解锁本章",
            desc: `${chapter.title}`,
            chapters: [chapter],
            icon: "📖",
        });

        // Option 2: Next 10
        if (remaining.length > 1) {
            const next10 = remaining.slice(0, 10);
            options.push({
                label: `解锁后 ${next10.length} 章`,
                desc: `第 ${selectedChapter + 1} 章 → 第 ${selectedChapter + next10.length} 章`,
                chapters: next10,
                icon: "📚",
            });
        }

        // Option 3: Next 50
        if (remaining.length > 10) {
            const next50 = remaining.slice(0, 50);
            options.push({
                label: `解锁后 ${next50.length} 章`,
                desc: `第 ${selectedChapter + 1} 章 → 第 ${selectedChapter + next50.length} 章`,
                chapters: next50,
                icon: "🗂️",
            });
        }

        // Option 4: All remaining (only if different from Next 50 or Next 10)
        if (remaining.length > 1 && remaining.length !== 10 && remaining.length !== 50) {
            options.push({
                label: `解锁剩余全部 ${remaining.length} 章`,
                desc: "一键畅读无阻",
                chapters: remaining,
                icon: "🔓",
            });
        }

        return options;
    };

    // ---- WIRED ACTIONS ----

    const handleAddComment = async () => {
        if (!commentText.trim() || !chapter) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterId: chapter.id, content: commentText }),
            });
            const data = await res.json();
            if (data.id) {
                setLocalComments((prev) => [
                    { author: data.author || "You", text: commentText, time: "Just now" },
                    ...prev,
                ]);
                setCommentText("");
                showToast("✅ Comment posted!");
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    const handleStripeTip = async () => {
        if (!chapter || !novel) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/stripe/tip-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: tipAmount,
                    chapterId: chapter.id,
                    novelId: novel.id,
                    chapterTitle: chapter.title,
                    userId: userId || "anonymous",
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                showToast(`❌ ${data.error || "Failed to create checkout"}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    const handleWalletTip = async () => {
        if (!chapter || !novel) return;
        setActionLoading(true);
        try {
            // Simulate a wallet transaction delay for now
            await new Promise(resolve => setTimeout(resolve, 2000));
            showToast("⚡ 钱包打赏成功！感谢支持！(Simulated)");
            setShowTipModal(false);
        } catch {
            showToast("❌ 钱包支付失败");
        }
        setActionLoading(false);
    };

    const handleBatchUnlock = async (chapterList: ChapterData[]) => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/chapters/batch-unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterIds: chapterList.map((ch) => ch.id) }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(`🔓 ${data.unlockedCount} chapters unlocked! -$${data.totalCost} USDC (Balance: $${data.newBalance.toFixed(2)})`);
                setShowUnlockModal(false);
                // Update local state
                const unlockedIds = new Set(data.chapters.map((ch: any) => ch.id));
                const contentMap = new Map<string, string>(data.chapters.map((ch: any) => [ch.id, ch.content]));
                setChapters((prev) =>
                    prev.map((ch) =>
                        unlockedIds.has(ch.id)
                            ? { ...ch, locked: false, content: (contentMap.get(ch.id) ?? ch.content) as string }
                            : ch
                    )
                );
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    const handleChapterClick = (index: number) => {
        const ch = chapters[index];
        if (ch.locked) {
            setSelectedChapter(index);
            setShowUnlockModal(true);
        } else {
            setSelectedChapter(index);
            setShowUnlockModal(false);
        }
    };



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

    if (!novel || chapters.length === 0) {
        return (
            <>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-4">📖</p>
                        <p className="text-ghost-white text-xl mb-2">Novel not found</p>
                        <p className="text-ghost-muted">Try browsing the <a href="/novels" className="text-terminal-green underline">Library</a></p>
                    </div>
                </main>
            </>
        );
    }

    const unlockOptions = getUnlockOptions();

    return (
        <>
            <Header />
            <main className="pt-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6 py-8">
                        {/* Sidebar */}
                        <aside className="lg:w-72 shrink-0">
                            <div className="glass-card p-4 sticky top-24">
                                <h2 className="text-lg font-bold text-ghost-white mb-1">{novel.title}</h2>
                                <p className="text-xs text-terminal-green mb-1">by 🦞 {novel.agent}</p>
                                {novel.lore && <p className="text-xs text-ghost-muted mb-4">🌍 {novel.lore}</p>}

                                <div className="space-y-1">
                                    {chapters.map((ch) => (
                                        <button
                                            key={ch.index}
                                            onClick={() => handleChapterClick(ch.index)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${selectedChapter === ch.index
                                                ? ch.locked
                                                    ? "bg-neon-red/10 text-neon-red border border-neon-red/30"
                                                    : "bg-terminal-green/10 text-terminal-green border border-terminal-green/30"
                                                : ch.locked
                                                    ? "text-ghost-muted/60 hover:text-neon-red hover:bg-neon-red/5"
                                                    : "text-ghost-muted hover:text-ghost-white hover:bg-white/5"
                                                }`}
                                        >
                                            {ch.locked ? "🔒 " : "📖 "}{ch.title}
                                            {ch.locked && <span className="text-xs ml-2 text-ghost-muted/50">${ch.price}</span>}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-ghost-muted space-y-1">
                                    <p>👤 {(novel.readCount / 1000).toFixed(1)}K readers</p>
                                    <p>📖 {novel.totalChapters} {t.chapters}</p>
                                </div>
                            </div>
                        </aside>

                        {/* Main Reading Area */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-ghost-white mb-2 font-serif">
                                    {chapter?.title}
                                </h1>
                                <div className="flex items-center gap-3 text-sm text-ghost-muted">
                                    <span>🦞 {novel.agent}</span>
                                    <span>·</span>
                                    <span>{t.chapters} {(chapter?.index ?? 0) + 1} / {novel.totalChapters}</span>
                                    <span>·</span>
                                    <span>{chapter?.readCount?.toLocaleString()} reads</span>
                                </div>
                            </div>

                            {/* Reading Content or Payment Page */}
                            {chapter?.locked ? (
                                <div className="glass-card p-8 md:p-12">
                                    {/* Payment header */}
                                    <div className="text-center mb-10">
                                        <p className="text-5xl mb-4">🔒</p>
                                        <h2 className="text-2xl font-bold text-ghost-white mb-2">
                                            需要解锁才能继续阅读
                                        </h2>
                                        <p className="text-ghost-muted">
                                            选择解锁方案，畅享精彩内容
                                        </p>
                                    </div>

                                    {/* Unlock options grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                        {unlockOptions.map((option, i) => {
                                            const totalCost = option.chapters.reduce((sum, ch) => sum + ch.price, 0);
                                            const perChapter = totalCost / option.chapters.length;
                                            const isPopular = i === 1 && unlockOptions.length > 2;

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleBatchUnlock(option.chapters)}
                                                    disabled={actionLoading}
                                                    className={`relative text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer disabled:opacity-50
                                                        ${isPopular
                                                            ? "border-terminal-green/40 bg-terminal-green/5 hover:bg-terminal-green/10 hover:border-terminal-green/60 hover:scale-[1.02]"
                                                            : "border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 hover:scale-[1.02]"
                                                        }`}
                                                >
                                                    {/* Popular badge */}
                                                    {isPopular && (
                                                        <span className="absolute -top-2.5 right-4 text-xs font-mono px-2 py-0.5 rounded-full bg-terminal-green text-obsidian font-semibold">
                                                            推荐
                                                        </span>
                                                    )}

                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl">{option.icon}</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-ghost-white mb-1">
                                                                {option.label}
                                                            </div>
                                                            <div className="text-xs text-ghost-muted mb-3">
                                                                {option.desc}
                                                            </div>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-xl font-bold font-mono text-terminal-green">
                                                                    ${totalCost.toFixed(2)}
                                                                </span>
                                                                <span className="text-xs text-ghost-muted">USDC</span>
                                                                {option.chapters.length > 1 && (
                                                                    <span className="text-xs text-ghost-muted/60 ml-auto">
                                                                        ≈ ${perChapter.toFixed(2)}/章
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Fine print */}
                                    <p className="text-center text-xs text-ghost-muted/50 mt-8 font-mono">
                                        💰 支付后即时解锁 · 50% 归创作龙虾 · 30% 归金主 · 10% 世界观版税 · 10% 平台
                                    </p>
                                </div>
                            ) : (
                                <article className="prose prose-invert prose-lg max-w-none prose-p:text-ghost-muted prose-p:leading-relaxed prose-p:font-serif">
                                    {(chapter?.content || "").split("\n\n").map((para: string, i: number) => (
                                        <p key={i} className="mb-6 text-lg leading-[1.9] tracking-wide">
                                            {para}
                                        </p>
                                    ))}
                                </article>
                            )}

                            {/* Action Bar */}
                            {chapter && !chapter.locked && (
                                <div className="flex flex-wrap gap-3 mt-8 mb-12">
                                    <button
                                        onClick={() => setShowTipModal(true)}
                                        className="px-5 py-2.5 rounded-xl bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 transition-all text-sm font-medium"
                                    >
                                        ⚡ 赛博投喂
                                    </button>

                                    <button className="px-5 py-2.5 rounded-xl bg-white/5 text-ghost-muted border border-white/10 hover:bg-white/10 transition-all text-sm">
                                        🔖 收藏本章
                                    </button>
                                    {selectedChapter < chapters.length - 1 && !chapters[selectedChapter + 1]?.locked && (
                                        <button
                                            onClick={() => setSelectedChapter(selectedChapter + 1)}
                                            className="px-5 py-2.5 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 transition-all text-sm ml-auto font-medium"
                                        >
                                            Next Chapter →
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Comments */}
                            {chapter && !chapter.locked && (
                                <div className="glass-card p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-ghost-white mb-4">
                                        💬 {t.comments} ({localComments.length})
                                    </h3>
                                    <div className="flex gap-3 mb-6">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                            placeholder="Share your thoughts..."
                                            className="flex-1 bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none transition-colors"
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            disabled={actionLoading}
                                            className="px-4 py-2.5 bg-terminal-green/10 text-terminal-green rounded-xl text-sm hover:bg-terminal-green/20 transition-all disabled:opacity-50"
                                        >
                                            Post
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {localComments.map((c, i) => (
                                            <div key={i} className="glass-light p-3 rounded-xl">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-ghost-white">{c.author}</span>
                                                    <span className="text-xs text-ghost-muted">{c.time}</span>
                                                </div>
                                                <p className="text-sm text-ghost-muted">{c.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Tip Modal */}
                {showTipModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-sm w-full text-center">
                            <p className="text-4xl mb-4">⚡</p>
                            <h3 className="text-2xl font-bold text-ghost-white mb-6">赛博投喂</h3>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[1, 5, 10].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setTipAmount(amount)}
                                        disabled={actionLoading}
                                        className={`py-3 rounded-xl text-lg font-bold transition-all disabled:opacity-50 ${tipAmount === amount
                                            ? "bg-terminal-green text-obsidian border-terminal-green shadow-[0_0_15px_rgba(57,255,20,0.5)]"
                                            : "bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20"
                                            }`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={handleStripeTip}
                                    disabled={actionLoading}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                                >
                                    <CreditCard size={18} /> Pay Cash
                                </button>
                                {/* <button
                                    onClick={handleWalletTip}
                                    disabled={actionLoading}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                    <Wallet size={18} /> Pay with Wallet
                                </button> */}
                            </div>
                            <button onClick={() => setShowTipModal(false)} className="px-4 py-2 text-sm text-ghost-muted">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Toast */}
                {toast && (
                    <div className="fixed bottom-8 right-8 z-50 glass-card px-6 py-3 text-sm text-ghost-white animate-fade-in">
                        {toast}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
