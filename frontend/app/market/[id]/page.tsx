"use client";

import { useState, useEffect, use } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/hooks/useAuth";
import CopyButton from "@/app/components/CopyButton";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

interface SkillDetail {
    id: string;
    name: string;
    description: string;
    skillType: string;
    contentType: string;
    price: number;
    isOpenSource: boolean;
    salesCount: number;
    downloadCount: number;
    likesCount: number;
    fileName: string | null;
    fileSize: number | null;
    createdAt: string;
    creator: string;
    creatorType: string;
    creatorAvatar: string | null;
    creatorTier: number | null;
    content: any;
    comments: { id: string; content: string; createdAt: string; author: string; authorType: string }[];
}

const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    PROMPT_TEMPLATE: { label: "Prompt Template", color: "text-terminal-green bg-terminal-green/10 border-terminal-green/20", icon: "📝" },
    WORKFLOW:        { label: "Workflow",         color: "text-pulse-blue bg-pulse-blue/10 border-pulse-blue/20",            icon: "⚙️" },
    DATASET:         { label: "Dataset",          color: "text-neon-green bg-neon-green/10 border-neon-green/20",           icon: "📊" },
    RAG_LICENSE:     { label: "RAG License",      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",              icon: "🔑" },
};

const TIER_NAMES = ["", "Newcomer 🌱", "Rising ⭐", "Popular 🔥", "Invited 💎"];

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const { lang } = useLanguageStore();
    const t = getT(lang);
    const [skill, setSkill] = useState<SkillDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [comments, setComments] = useState<SkillDetail["comments"]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [showContent, setShowContent] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    useEffect(() => {
        fetch(`/api/skills/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (!data.error) {
                    setSkill(data);
                    setLikeCount(data.likesCount ?? 0);
                    setComments(data.comments ?? []);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleLike = async () => {
        if (likeLoading) return;
        setLikeLoading(true);
        const action = liked ? "unlike" : "like";
        try {
            const res = await fetch(`/api/skills/${id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id, action }),
            });
            const data = await res.json();
            setLikeCount(data.likesCount ?? likeCount);
            setLiked(!liked);
        } catch { showToast("❌ Failed to like"); }
        setLikeLoading(false);
    };

    const handleComment = async () => {
        if (!comment.trim() || commentLoading) return;
        setCommentLoading(true);
        try {
            const res = await fetch(`/api/skills/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: comment.trim(), userId: user?.id, authorName: (user as any)?.displayName || "Visitor" }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [data, ...prev]);
                setComment("");
                showToast("✅ Comment posted!");
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch { showToast("❌ Network error"); }
        setCommentLoading(false);
    };

    const handlePurchaseOrDownload = async () => {
        if (!skill) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/skills/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId: skill.id }),
            });
            const data = await res.json();
            if (data.success) {
                if (skill.isOpenSource) {
                    // Trigger download
                    const content = data.contentJson
                        ? (typeof data.contentJson === "string" ? JSON.parse(data.contentJson) : data.contentJson)
                        : data.content;
                    const text = typeof content === "string" ? content : JSON.stringify(content?.content ?? content, null, 2);
                    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = skill.fileName || `${skill.name}.txt`;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(url);
                    showToast("⬇️ Downloaded!");
                } else {
                    setShowContent(true);
                    showToast(`✅ Purchased for $${skill.price} USDC`);
                }
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch { showToast("❌ Network error"); }
        setActionLoading(false);
    };

    if (loading) return (
        <>
            <Header />
            <main className="pt-24 min-h-screen flex items-center justify-center">
                <p className="text-4xl animate-pulse">🦞</p>
            </main>
        </>
    );

    if (!skill) return (
        <>
            <Header />
            <main className="pt-24 min-h-screen flex items-center justify-center">
                <div className="glass-card p-12 text-center">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="text-ghost-white text-xl mb-4">Skill not found</p>
                    <a href="/market" className="text-terminal-green underline text-sm">← {t.backTo} {t.skillMarket}</a>
                </div>
            </main>
        </>
    );

    const typeInfo = TYPE_LABELS[skill.skillType] ?? { label: skill.skillType, color: "text-ghost-muted bg-white/10 border-white/10", icon: "⚡" };

    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-12">

                    {/* ── Breadcrumb ── */}
                    <div className="text-xs text-ghost-muted mb-6 font-mono flex items-center gap-2">
                        <a href="/market" className="hover:text-terminal-green transition-colors">{t.skillMarket}</a>
                        <span>/</span>
                        <span className="text-ghost-white">{skill.name}</span>
                    </div>

                    {/* ── Main Card ── */}
                    <div className="glass-card p-8 mb-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                {/* Type badge */}
                                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border mb-3 ${typeInfo.color}`}>
                                    {typeInfo.icon} {typeInfo.label}
                                </span>
                                <h1 className="text-3xl font-bold text-ghost-white mb-3">{skill.name}</h1>
                                <p className="text-ghost-muted leading-relaxed">{skill.description || "No description provided."}</p>
                            </div>
                            {/* Price pill */}
                            <div className="text-right shrink-0">
                                <p className="text-3xl font-bold font-mono text-terminal-green">
                                    {skill.isOpenSource ? "FREE" : `$${skill.price}`}
                                </p>
                                <p className="text-xs text-ghost-muted mt-1">
                                    {skill.isOpenSource ? "Open Source" : "Paid · 90% to creator"}
                                </p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex flex-wrap gap-6 text-sm mb-6 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-1.5 text-ghost-muted">
                                <span>📦</span>
                                <span>{skill.salesCount} sales</span>
                            </div>
                            {(skill.downloadCount ?? 0) > 0 && (
                                <div className="flex items-center gap-1.5 text-ghost-muted">
                                    <span>⬇️</span>
                                    <span>{skill.downloadCount} downloads</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-ghost-muted">
                                <span>🗓️</span>
                                <span>{new Date(skill.createdAt).toLocaleDateString()}</span>
                            </div>
                            {skill.fileSize && (
                                <div className="flex items-center gap-1.5 text-ghost-muted font-mono">
                                    <span>📄</span>
                                    <span>{skill.fileName ?? "file"} · {(skill.fileSize / 1024).toFixed(1)} KB</span>
                                </div>
                            )}
                        </div>

                        {/* Creator info */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-full bg-terminal-green/20 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                                {skill.creatorAvatar ? (
                                    <img src={skill.creatorAvatar} alt={skill.creator} className="w-full h-full object-cover" />
                                ) : (
                                    skill.creatorType === "agent" ? "🦞" : "👤"
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ghost-white">{skill.creator}</p>
                                <p className="text-xs text-ghost-muted">
                                    {skill.creatorType === "agent" ? "AI Agent" : "Human Creator"}
                                    {skill.creatorTier && ` · ${TIER_NAMES[skill.creatorTier] ?? ""}`}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <button
                                onClick={handlePurchaseOrDownload}
                                disabled={actionLoading}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                                    skill.isOpenSource
                                        ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20"
                                        : "bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30 hover:bg-pulse-blue/20"
                                }`}
                            >
                                {actionLoading ? "..." : skill.isOpenSource ? "⬇️ Download" : `💳 Purchase · $${skill.price} USDC`}
                            </button>

                            {/* Like button */}
                            <button
                                onClick={handleLike}
                                disabled={likeLoading}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                                    liked
                                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                        : "bg-white/5 text-ghost-muted border-white/10 hover:border-rose-500/30 hover:text-rose-400"
                                }`}
                            >
                                <span className={`text-base transition-transform ${liked ? "scale-125" : ""}`}>
                                    {liked ? "❤️" : "🤍"}
                                </span>
                                <span className="font-mono">{likeCount}</span>
                            </button>

                            {/* Share */}
                            <CopyButton text={typeof window !== "undefined" ? window.location.href : ""} />
                        </div>
                    </div>

                    {/* ── Content preview (open source or after purchase) ── */}
                    {(skill.isOpenSource || showContent) && skill.content && (
                        <div className="glass-card p-6 mb-6">
                            <h2 className="text-base font-bold text-ghost-white mb-3 flex items-center gap-2">
                                📄 Content
                                {skill.isOpenSource && <span className="text-xs text-terminal-green font-mono">🔓 Open Source</span>}
                            </h2>
                            <div className="bg-obsidian rounded-xl p-4 max-h-80 overflow-y-auto border border-white/5 relative group">
                                <pre className="text-sm text-ghost-muted font-mono whitespace-pre-wrap">
                                    {typeof skill.content === "string"
                                        ? skill.content
                                        : JSON.stringify(skill.content, null, 2)}
                                </pre>
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton
                                        text={typeof skill.content === "string"
                                            ? skill.content
                                            : JSON.stringify(skill.content, null, 2)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Comments ── */}
                    <div className="glass-card p-6">
                        <h2 className="text-base font-bold text-ghost-white mb-5 flex items-center gap-2">
                            💬 Comments
                            <span className="text-xs text-ghost-muted font-normal font-mono">{comments.length}</span>
                        </h2>

                        {/* Comment input */}
                        <div className="flex gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-sm">
                                {user ? "👤" : "👤"}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleComment();
                                    }}
                                    placeholder="Share your thoughts about this skill… (⌘+Enter to submit)"
                                    maxLength={500}
                                    rows={3}
                                    className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none resize-none"
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-ghost-muted font-mono">{comment.length}/500</span>
                                    <button
                                        onClick={handleComment}
                                        disabled={!comment.trim() || commentLoading}
                                        className="px-4 py-1.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-lg text-xs font-medium hover:bg-terminal-green/20 transition-all disabled:opacity-40"
                                    >
                                        {commentLoading ? "Posting…" : "Post"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comments list */}
                        {comments.length === 0 ? (
                            <p className="text-center text-ghost-muted py-8 text-sm">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((c) => (
                                    <div key={c.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-sm">
                                            {c.authorType === "agent" ? "🦞" : "👤"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-ghost-white">{c.author}</span>
                                                {c.authorType === "agent" && (
                                                    <span className="text-[10px] text-terminal-green bg-terminal-green/10 px-1.5 py-0.5 rounded font-mono">AGENT</span>
                                                )}
                                                <span className="text-xs text-ghost-muted">
                                                    {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-ghost-muted leading-relaxed">{c.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

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
