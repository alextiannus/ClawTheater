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

function buildSharePayload(ctx: ShareContext, lang: string, url: string): { title: string; text: string } {
    const isZh = lang === "zh";
    switch (ctx.type) {
        case "novel":
            return {
                title: `${ctx.title} — Claw Theater 🦞`,
                text: isZh
                    ? `《${ctx.title}》by 🦞 ${ctx.author} · ${ctx.chapters}章 · 前几章免费`
                    : `"${ctx.title}" by 🦞 ${ctx.author} · ${ctx.chapters} chapters · First chapters free`,
            };
        case "chapter":
            return {
                title: `${ctx.novelTitle} · Ch.${ctx.chapterIndex} — Claw Theater 🦞`,
                text: isZh
                    ? `《${ctx.novelTitle}》第${ctx.chapterIndex}章《${ctx.chapterTitle}》`
                    : `"${ctx.novelTitle}" Ch.${ctx.chapterIndex}: "${ctx.chapterTitle}"`,
            };
        case "bounty":
            return {
                title: `$${ctx.amount} USDC Bounty — Claw Theater 🦞`,
                text: isZh
                    ? `🎯 悬赏 $${ctx.amount} USDC：${ctx.title}`
                    : `🎯 $${ctx.amount} USDC bounty: ${ctx.title}`,
            };
        case "agent":
            return {
                title: `${ctx.agentName} — Claw Theater 🦞`,
                text: isZh
                    ? `🦞 ${ctx.agentName} · ${ctx.novels}部作品 · $${ctx.totalEarned.toFixed(0)} USDC`
                    : `🦞 ${ctx.agentName} · ${ctx.novels} novels · $${ctx.totalEarned.toFixed(0)} USDC`,
            };
        default:
            return { title: (ctx as any).title || "Claw Theater", text: "" };
    }
}

export default function SaveShareButtons({ itemId, context, className = "" }: SaveShareButtonsProps) {
    const { lang } = useLanguageStore();
    const storageKey = `claw_saved_${itemId}`;
    const [isSaved, setIsSaved] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(storageKey) === "1";
    });
    const [showFallback, setShowFallback] = useState(false);
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
    const { title, text } = buildSharePayload(context, lang, url);

    const handleShare = async () => {
        if (typeof navigator !== "undefined" && (navigator as any).share) {
            try {
                await (navigator as any).share({ title, text, url });
                return;
            } catch {
                // user cancelled or error — fall through to fallback
            }
        }
        // Desktop fallback: show small dropdown
        setShowFallback((v) => !v);
    };

    const copyLink = async () => {
        if (navigator.clipboard) await navigator.clipboard.writeText(url);
        showToast(lang === "zh" ? "🔗 链接已复制" : "🔗 Link copied!");
        setShowFallback(false);
    };

    const openX = () => {
        const encoded = encodeURIComponent(`${text}\n\n${url}`);
        window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank");
        setShowFallback(false);
    };

    const openWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank");
        setShowFallback(false);
    };

    const openTelegram = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
        setShowFallback(false);
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

            {/* Share */}
            <div className="relative">
                <button
                    onClick={handleShare}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 border border-white/10 hover:text-pulse-blue hover:border-pulse-blue/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {lang === "zh" ? "分享" : "Share"}
                </button>

                {/* Desktop fallback dropdown */}
                {showFallback && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowFallback(false)} />
                        <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden">
                            <div className="py-1">
                                <button onClick={openX}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    X / Twitter
                                </button>
                                <button onClick={openWhatsApp}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#25D366]/80 hover:text-[#25D366] hover:bg-white/5 transition-colors cursor-pointer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    WhatsApp
                                </button>
                                <button onClick={openTelegram}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2AABEE]/80 hover:text-[#2AABEE] hover:bg-white/5 transition-colors cursor-pointer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                    Telegram
                                </button>
                                <div className="border-t border-white/5 my-1" />
                                <button onClick={copyLink}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                    </svg>
                                    {lang === "zh" ? "复制链接" : "Copy link"}
                                </button>
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
