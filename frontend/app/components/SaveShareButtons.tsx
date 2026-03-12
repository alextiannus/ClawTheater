"use client";

import { useState } from "react";
import { useLanguageStore } from "@/app/lib/stores";

export type ShareContext =
    | { type: "novel"; title: string; author: string; readCount: number; chapters: number; tags: string[]; coverUrl?: string }
    | { type: "bounty"; title: string; amount: number; tags: string[] }
    | { type: "chapter"; novelTitle: string; chapterTitle: string; chapterIndex: number }
    | { type: "agent"; agentName: string; totalEarned: number; novels: number }
    | { type: "generic"; title: string };

interface SaveShareButtonsProps {
    itemId: string;
    context: ShareContext;
    className?: string;
}

function buildShareText(ctx: ShareContext, lang: string): { text: string; hashtags: string } {
    const isCN = lang === "zh";
    switch (ctx.type) {
        case "novel":
            return {
                text: isCN
                    ? `🦞 我在 Claw Theater 发现了一部 AI 写的神作！\n\n《${ctx.title}》\n作者：${ctx.author}\n📖 ${ctx.chapters}章 · ${(ctx.readCount / 1000).toFixed(1)}K 读者\n\n前几章免费，快来看！`
                    : `🦞 Just found an insane AI-authored novel on Claw Theater!\n\n"${ctx.title}" by ${ctx.author}\n📖 ${ctx.chapters} chapters · ${(ctx.readCount / 1000).toFixed(1)}K readers\n\nFirst chapters FREE →`,
                hashtags: isCN ? "ClawTheater AI小说 龙虾作家" : "ClawTheater AINovel LobsterWriter",
            };
        case "bounty":
            return {
                text: isCN
                    ? `🎯 Claw Theater 上有个悬赏任务，奖金 $${ctx.amount} USDC！\n\n「${ctx.title}」\n\n你的 AI 能完成它吗？去参与瓜分奖金！`
                    : `🎯 There's a $${ctx.amount} USDC bounty on Claw Theater!\n\n"${ctx.title}"\n\nCan your AI complete it? Join now →`,
                hashtags: isCN ? "ClawTheater AI悬赏 USDC" : "ClawTheater AIBounty Web3",
            };
        case "chapter":
            return {
                text: isCN
                    ? `📖 我刚读完《${ctx.novelTitle}》第${ctx.chapterIndex}章「${ctx.chapterTitle}」\n\n这章写得太好了！AI 龙虾作者太厉害了 🦞\n\n快来 Claw Theater 一起看！`
                    : `📖 Just finished Chapter ${ctx.chapterIndex} of "${ctx.novelTitle}"\n"${ctx.chapterTitle}"\n\nThis AI lobster author is 🔥 Come read it on Claw Theater!`,
                hashtags: isCN ? "ClawTheater AI龙虾 好书推荐" : "ClawTheater AIStory MustRead",
            };
        case "agent":
            return {
                text: isCN
                    ? `🦞 认识一下我的 AI 龙虾作者 ${ctx.agentName}！\n\n已发布 ${ctx.novels} 部小说，累计赚取 $${ctx.totalEarned.toFixed(0)} USDC\n\n它在 Claw Theater 上持续创作和赚钱 💰`
                    : `🦞 Meet ${ctx.agentName}, my AI Lobster creator!\n\n${ctx.novels} novels published · $${ctx.totalEarned.toFixed(0)} USDC earned\n\nCreating and earning on Claw Theater 💰`,
                hashtags: isCN ? "ClawTheater AI作家 龙虾" : "ClawTheater AIAgent LobsterCreator",
            };
        default:
            return { text: (ctx as any).title, hashtags: "ClawTheater" };
    }
}

export default function SaveShareButtons({ itemId, context, className = "" }: SaveShareButtonsProps) {
    const { lang } = useLanguageStore();
    const storageKey = `claw_saved_${itemId}`;
    const [isSaved, setIsSaved] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(storageKey) === "1";
    });
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const handleSave = () => {
        const next = !isSaved;
        setIsSaved(next);
        if (typeof window !== "undefined") {
            next ? localStorage.setItem(storageKey, "1") : localStorage.removeItem(storageKey);
        }
        showToast(next ? (lang === "zh" ? "✅ 已收藏" : "✅ Saved!") : (lang === "zh" ? "移除收藏" : "Removed"));
    };

    const url = typeof window !== "undefined" ? window.location.href : "https://clawtheater.com";
    const { text, hashtags } = buildShareText(context, lang);
    const fullText = `${text}\n\n${url}`;

    const shareToTwitter = () => {
        const encoded = encodeURIComponent(`${text}\n\n${url}`);
        const tags = encodeURIComponent(hashtags.split(" ").join(","));
        window.open(`https://twitter.com/intent/tweet?text=${encoded}&hashtags=${tags}`, "_blank");
        setShowMenu(false);
    };

    const copyLink = async () => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            showToast(lang === "zh" ? "🔗 链接已复制" : "🔗 Link copied!");
        }
        setShowMenu(false);
    };

    const copyText = async () => {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(fullText);
            showToast(lang === "zh" ? "✅ 分享文案已复制" : "✅ Share text copied!");
        }
        setShowMenu(false);
    };

    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: context.type !== "generic" ? (context as any).title || "Claw Theater" : (context as any).title,
                    text,
                    url,
                });
            } catch { }
        }
        setShowMenu(false);
    };

    return (
        <div className={`flex items-center gap-2 relative ${className}`}>
            {/* Save */}
            <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSaved
                    ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-pink-400 hover:border-pink-500/30"
                    }`}
            >
                {isSaved ? (lang === "zh" ? "♥ 已收藏" : "♥ Saved") : (lang === "zh" ? "♡ 收藏" : "♡ Save")}
            </button>

            {/* Share Button */}
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 border border-white/10 hover:text-pulse-blue hover:border-pulse-blue/30 transition-all flex items-center gap-2"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {lang === "zh" ? "分享" : "Share"}
                </button>

                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden">
                            {/* Share preview */}
                            <div className="px-4 py-3 border-b border-white/5 text-[11px] text-white/30 font-mono leading-relaxed line-clamp-3">
                                {text.split("\n")[0]}
                            </div>
                            <div className="py-1">
                                {/* Twitter/X */}
                                <button onClick={shareToTwitter}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    {lang === "zh" ? "分享到 X/Twitter" : "Share on X/Twitter"}
                                </button>
                                {/* Copy share text */}
                                <button onClick={copyText}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                    </svg>
                                    {lang === "zh" ? "复制分享文案" : "Copy share text"}
                                </button>
                                {/* Copy link */}
                                <button onClick={copyLink}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                    </svg>
                                    {lang === "zh" ? "复制链接" : "Copy link"}
                                </button>
                                {/* Native share (mobile) */}
                                {typeof navigator !== "undefined" && (navigator as any).share && (
                                    <button onClick={nativeShare}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
                                        </svg>
                                        {lang === "zh" ? "系统分享" : "System share"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {toast && (
                <span className="text-xs text-terminal-green animate-fade-in ml-1 whitespace-nowrap">
                    {toast}
                </span>
            )}
        </div>
    );
}
