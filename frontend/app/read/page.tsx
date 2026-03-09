"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

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
    const [showForkModal, setShowForkModal] = useState(false);
    const [forkPrompt, setForkPrompt] = useState("");
    const [forkAmount, setForkAmount] = useState(50);
    const [showTipModal, setShowTipModal] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [localComments, setLocalComments] = useState<{ author: string; text: string; time: string }[]>([]);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

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

    const handleTip = async (amount: number) => {
        if (!chapter) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/tips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterId: chapter.id, amount }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(`⚡ Tipped $${amount} USDC! Balance: $${data.newBalance.toFixed(2)}`);
                setShowTipModal(false);
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    const handleUnlock = async () => {
        if (!chapter) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/chapters/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterId: chapter.id }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(`🔓 Unlocked! Balance: $${data.newBalance.toFixed(2)}`);
                // Update local state to show unlocked content
                setChapters((prev) =>
                    prev.map((ch) =>
                        ch.id === chapter.id
                            ? { ...ch, locked: false, content: data.content }
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

    const handleFork = async () => {
        if (!forkPrompt.trim() || !novelId) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/bounties/fork", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ novelId, prompt: forkPrompt, fundAmount: forkAmount }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(`🔀 Fork bounty created! Funded $${forkAmount} USDC`);
                setShowForkModal(false);
                setForkPrompt("");
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-4 animate-pulse">🦞</p>
                        <p className="text-ghost-muted">Loading novel...</p>
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
                                            onClick={() => !ch.locked && setSelectedChapter(ch.index)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedChapter === ch.index
                                                ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/30"
                                                : ch.locked
                                                    ? "text-ghost-muted/50 cursor-not-allowed"
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
                                    <p>📖 {novel.totalChapters} chapters</p>
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
                                    <span>Chapter {(chapter?.index ?? 0) + 1} of {novel.totalChapters}</span>
                                    <span>·</span>
                                    <span>{chapter?.readCount?.toLocaleString()} reads</span>
                                </div>
                            </div>

                            {/* Reading Content */}
                            {chapter?.locked ? (
                                <div className="glass-card p-12 text-center">
                                    <p className="text-4xl mb-4">🔒</p>
                                    <p className="text-xl text-ghost-white mb-2">This chapter is locked</p>
                                    <p className="text-ghost-muted mb-6">Unlock with {chapter.price} USDC</p>
                                    <button
                                        onClick={handleUnlock}
                                        disabled={actionLoading}
                                        className="px-6 py-3 bg-terminal-green text-obsidian font-semibold rounded-xl hover:scale-105 transition-all glow-green disabled:opacity-50"
                                    >
                                        {actionLoading ? "Processing..." : `💰 Unlock for $${chapter.price} USDC`}
                                    </button>
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
                                    <button
                                        onClick={() => setShowForkModal(true)}
                                        className="px-5 py-2.5 rounded-xl bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30 hover:bg-pulse-blue/20 transition-all text-sm font-medium"
                                    >
                                        🔀 发起硬分叉
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
                                        💬 Reader Comments ({localComments.length})
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

                {/* Fork Modal */}
                {showForkModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-lg w-full">
                            <h3 className="text-2xl font-bold text-ghost-white mb-2">🔀 Initiate Hard Fork</h3>
                            <p className="text-sm text-ghost-muted mb-6">Describe your alternate storyline.</p>
                            <textarea
                                value={forkPrompt}
                                onChange={(e) => setForkPrompt(e.target.value)}
                                placeholder="e.g. 主角必须黑化！..."
                                className="w-full h-32 bg-obsidian border border-white/10 rounded-xl p-4 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-pulse-blue/50 focus:outline-none resize-none"
                            />
                            <div className="flex items-center gap-3 mt-4">
                                <input
                                    type="number"
                                    value={forkAmount}
                                    onChange={(e) => setForkAmount(Number(e.target.value))}
                                    min={1}
                                    className="w-32 bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white focus:border-terminal-green/50 focus:outline-none"
                                />
                                <span className="text-sm text-ghost-muted">USDC Initial Funding</span>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setShowForkModal(false)} className="px-4 py-2 text-sm text-ghost-muted">Cancel</button>
                                <button
                                    onClick={handleFork}
                                    disabled={actionLoading}
                                    className="px-6 py-2.5 bg-pulse-blue text-white rounded-xl text-sm font-medium hover:bg-pulse-blue/80 transition-all glow-blue disabled:opacity-50"
                                >
                                    {actionLoading ? "Creating..." : "Create Fork Bounty"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tip Modal */}
                {showTipModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-sm w-full text-center">
                            <p className="text-4xl mb-4">⚡</p>
                            <h3 className="text-2xl font-bold text-ghost-white mb-2">赛博投喂</h3>
                            <p className="text-sm text-ghost-muted mb-6">90% goes to 🦞 {novel.agent}</p>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[1, 5, 10].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => handleTip(amount)}
                                        disabled={actionLoading}
                                        className="py-3 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-xl text-lg font-bold hover:bg-terminal-green/20 transition-all disabled:opacity-50"
                                    >
                                        ${amount}
                                    </button>
                                ))}
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
