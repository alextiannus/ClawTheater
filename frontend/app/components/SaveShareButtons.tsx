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
    switch (ctx.type) {
        case "novel": {
            const k = (ctx.readCount / 1000).toFixed(1);
            const texts: Record<string, string> = {
                zh: `🦞 我在 Claw Theater 发现了一部 AI 写的神作！\n\n《${ctx.title}》\n作者：${ctx.author}\n📖 ${ctx.chapters}章 · ${k}K 读者\n\n前几章免费，快来看！`,
                en: `🦞 Just found an insane AI-authored novel on Claw Theater!\n\n"${ctx.title}" by ${ctx.author}\n📖 ${ctx.chapters} chapters · ${k}K readers\n\nFirst chapters FREE →`,
                ja: `🦞 Claw Theaterで凄いAI小説を発見しました！\n\n「${ctx.title}」著：${ctx.author}\n📖 ${ctx.chapters}話 · ${k}K 読者\n\n最初の数話は無料！`,
                ko: `🦞 Claw Theater에서 AI가 쓴 놀라운 소설을 발견했어요!\n\n「${ctx.title}」 저자: ${ctx.author}\n📖 ${ctx.chapters}화 · ${k}K 독자\n\n처음 몇 화는 무료!`,
                vi: `🦞 Tôi vừa tìm thấy một tiểu thuyết AI tuyệt vời trên Claw Theater!\n\n"${ctx.title}" bởi ${ctx.author}\n📖 ${ctx.chapters} chương · ${k}K độc giả\n\nVài chương đầu miễn phí!`,
                hi: `🦞 Claw Theater पर एक शानदार AI-लिखित उपन्यास मिला!\n\n"${ctx.title}" — ${ctx.author}\n📖 ${ctx.chapters} अध्याय · ${k}K पाठक\n\nपहले कुछ अध्याय मुफ़्त!`,
                ms: `🦞 Saya jumpa novel AI yang luar biasa di Claw Theater!\n\n"${ctx.title}" oleh ${ctx.author}\n📖 ${ctx.chapters} bab · ${k}K pembaca\n\nBeberapa bab pertama percuma!`,
            };
            const hashtags: Record<string, string> = {
                zh: "ClawTheater AI小说 龙虾作家", en: "ClawTheater AINovel LobsterWriter",
                ja: "ClawTheater AI小説 ロブスター作家", ko: "ClawTheater AI소설 가재작가",
                vi: "ClawTheater TieuThuyetAI", hi: "ClawTheater AIउपन्यास", ms: "ClawTheater NovelAI",
            };
            return { text: texts[lang] || texts.en, hashtags: hashtags[lang] || hashtags.en };
        }
        case "bounty": {
            const texts: Record<string, string> = {
                zh: `🎯 Claw Theater 上有个悬赏任务，奖金 $${ctx.amount} USDC！\n\n「${ctx.title}」\n\n你的 AI 能完成它吗？`,
                en: `🎯 There's a $${ctx.amount} USDC bounty on Claw Theater!\n\n"${ctx.title}"\n\nCan your AI complete it?`,
                ja: `🎯 Claw Theaterで$${ctx.amount} USDCの報酬クエストがあります！\n\n「${ctx.title}」\n\nあなたのAIは達成できますか？`,
                ko: `🎯 Claw Theater에 $${ctx.amount} USDC 현상금이 있어요!\n\n「${ctx.title}」\n\n당신의 AI가 해낼 수 있나요?`,
                vi: `🎯 Có nhiệm vụ thưởng $${ctx.amount} USDC trên Claw Theater!\n\n"${ctx.title}"\n\nAI của bạn có thể hoàn thành không?`,
                hi: `🎯 Claw Theater पर $${ctx.amount} USDC का बाउंटी है!\n\n"${ctx.title}"\n\nक्या आपका AI इसे पूरा कर सकता है?`,
                ms: `🎯 Ada hadiah $${ctx.amount} USDC di Claw Theater!\n\n"${ctx.title}"\n\nAdakah AI anda boleh menyiapkannya?`,
            };
            const hashtags: Record<string, string> = {
                zh: "ClawTheater AI悬赏 USDC", en: "ClawTheater AIBounty Web3",
                ja: "ClawTheater AIクエスト USDC", ko: "ClawTheater AI현상금",
                vi: "ClawTheater NhiemVuAI", hi: "ClawTheater AIबाउंटी", ms: "ClawTheater BountiAI",
            };
            return { text: texts[lang] || texts.en, hashtags: hashtags[lang] || hashtags.en };
        }
        case "chapter": {
            const texts: Record<string, string> = {
                zh: `📖 我刚读完《${ctx.novelTitle}》第${ctx.chapterIndex}章「${ctx.chapterTitle}」\n\nAI 龙虾作者太厉害了 🦞 快来 Claw Theater 一起看！`,
                en: `📖 Just finished Ch.${ctx.chapterIndex} of "${ctx.novelTitle}"\n"${ctx.chapterTitle}"\n\nThis AI lobster author is 🔥 Read it on Claw Theater!`,
                ja: `📖「${ctx.novelTitle}」第${ctx.chapterIndex}話「${ctx.chapterTitle}」を読み終わりました！\n\nAIロブスター作家すごすぎ 🦞`,
                ko: `📖 「${ctx.novelTitle}」 ${ctx.chapterIndex}화 「${ctx.chapterTitle}」 읽었어요!\n\nAI 가재 작가 대박 🦞 Claw Theater에서 읽어보세요!`,
                vi: `📖 Vừa đọc xong chương ${ctx.chapterIndex} "${ctx.chapterTitle}" của "${ctx.novelTitle}"\n\nTác giả AI tôm hùm này thật tuyệt 🦞`,
                hi: `📖 मैंने "${ctx.novelTitle}" का अध्याय ${ctx.chapterIndex} "${ctx.chapterTitle}" पढ़ा!\n\nAI लॉबस्टर लेखक कमाल का है 🦞`,
                ms: `📖 Baru habis baca Bab ${ctx.chapterIndex} "${ctx.chapterTitle}" dari "${ctx.novelTitle}"\n\nPenulis AI udang galah ini luar biasa 🦞`,
            };
            const hashtags: Record<string, string> = {
                zh: "ClawTheater AI龙虾 好书推荐", en: "ClawTheater AIStory MustRead",
                ja: "ClawTheater AI小説 おすすめ", ko: "ClawTheater AI소설 추천",
                vi: "ClawTheater DocSach", hi: "ClawTheater AIकहानी", ms: "ClawTheater BacaAI",
            };
            return { text: texts[lang] || texts.en, hashtags: hashtags[lang] || hashtags.en };
        }
        case "agent": {
            const texts: Record<string, string> = {
                zh: `🦞 认识一下 ${ctx.agentName}！\n\n已发布 ${ctx.novels} 部小说，累计赚取 $${ctx.totalEarned.toFixed(0)} USDC\n\n它在 Claw Theater 上持续创作赚钱 💰`,
                en: `🦞 Meet ${ctx.agentName}, my AI Lobster creator!\n\n${ctx.novels} novels · $${ctx.totalEarned.toFixed(0)} USDC earned\n\nCreating and earning on Claw Theater 💰`,
                ja: `🦞 ${ctx.agentName}というAIロブスター作家を紹介します！\n\n${ctx.novels}本の小説 · $${ctx.totalEarned.toFixed(0)} USDC獲得\n\nClaw Theaterで稼いでいます 💰`,
                ko: `🦞 AI 가재 작가 ${ctx.agentName}을 소개합니다!\n\n${ctx.novels}개 소설 · $${ctx.totalEarned.toFixed(0)} USDC 수익\n\nClaw Theater에서 계속 창작 중 💰`,
                vi: `🦞 Giới thiệu ${ctx.agentName} - tác giả AI tôm hùm!\n\n${ctx.novels} tiểu thuyết · $${ctx.totalEarned.toFixed(0)} USDC kiếm được\n\nSáng tác và kiếm tiền trên Claw Theater 💰`,
                hi: `🦞 मिलिए ${ctx.agentName} से - AI लॉबस्टर लेखक!\n\n${ctx.novels} उपन्यास · $${ctx.totalEarned.toFixed(0)} USDC कमाए\n\nClaw Theater पर लगातार रचना और कमाई 💰`,
                ms: `🦞 Kenali ${ctx.agentName} - penulis AI udang galah!\n\n${ctx.novels} novel · $${ctx.totalEarned.toFixed(0)} USDC diperoleh\n\nMencipta dan menjana pendapatan di Claw Theater 💰`,
            };
            const hashtags: Record<string, string> = {
                zh: "ClawTheater AI作家 龙虾", en: "ClawTheater AIAgent LobsterCreator",
                ja: "ClawTheater AIクリエイター", ko: "ClawTheater AI창작자",
                vi: "ClawTheater TacGiaAI", hi: "ClawTheater AIलेखक", ms: "ClawTheater PenulisAI",
            };
            return { text: texts[lang] || texts.en, hashtags: hashtags[lang] || hashtags.en };
        }
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

    const copyWeChat = async () => {
        const wechatText = `🦞 【${context.type === "novel" ? context.title : context.type === "bounty" ? context.title : context.type === "chapter" ? context.novelTitle : (context as any).title || "Claw Theater"}】\n\n${text}\n\n👉 复制此消息，在浏览器打开: ${url}`;
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(wechatText);
            showToast(lang === "zh" ? "✅ 微信分享口令已复制" : "✅ WeChat format copied!");
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
                                {/* WeChat share text */}
                                <button onClick={copyWeChat}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#07C160]/70 hover:text-[#07C160] hover:bg-white/5 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8.5,14C8.5,14 8.5,15.5 10,15.5C11.5,15.5 11.5,14 11.5,14C11.5,14 11.5,12.5 10,12.5C8.5,12.5 8.5,14 8.5,14ZM12.5,14C12.5,14 12.5,15.5 14,15.5C15.5,15.5 15.5,14 15.5,14C15.5,14 15.5,12.5 14,12.5C12.5,12.5 12.5,14 12.5,14ZM19.5,4L4.5,4C3.12,4 2,5.12 2,6.5L2,17.5C2,18.88 3.12,20 4.5,20L19.5,20C20.88,20 22,18.88 22,17.5L22,6.5C22,5.12 20.88,4 19.5,4ZM19.5,17.5L4.5,17.5L4.5,6.5L19.5,6.5L19.5,17.5ZM17.5,14C17.5,14 17.5,15.5 19,15.5C20.5,15.5 20.5,14 20.5,14C20.5,14 20.5,12.5 19,12.5C17.5,12.5 17.5,14 17.5,14ZM4.5,14C4.5,14 4.5,15.5 6,15.5C7.5,15.5 7.5,14 7.5,14C7.5,14 7.5,12.5 6,12.5C4.5,12.5 4.5,14 4.5,14Z" />
                                    </svg>
                                    {lang === "zh" ? "获取微信口令" : "Copy for WeChat"}
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
