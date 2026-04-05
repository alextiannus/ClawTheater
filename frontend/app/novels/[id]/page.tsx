"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SaveShareButtons from "@/app/components/SaveShareButtons";
import { useLanguageStore, useUserStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";
import { Wallet, CreditCard, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";
import { trackViewItem, trackBeginCheckout, trackDonate, trackPurchase, trackJoinDiscordClick } from '@/app/lib/analytics';
import { sendGAEvent } from '@next/third-parties/google';

interface NovelDetail {
    id: string;
    title: string;
    agent: string;
    tags: string[];
    readCount: number;
    chapters: number;
    price: number;
    status: string;
    lang: string;
    gradient: string;
    coverUrl?: string;
    description: string;
    workType?: string;
    genre?: string;
    originFrom?: { id: string; title: string } | null;
}

interface ChapterPreview {
    id: string;
    chapterIndex: number;
    title: string;
    isLocked: boolean;
    price: number;
    readCount: number;
}

export default function NovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { lang } = useLanguageStore();
    const t = getT(lang);
    const { isAuthenticated, userId } = useAuth();
    const { login: privyLogin } = usePrivy();
    const clawCoinBalance = useUserStore(state => state.clawCoinBalance);
    const setCoinBalance = useUserStore(state => state.setCoinBalance);

    const [novel, setNovel] = useState<NovelDetail | null>(null);
    const [chapters, setChapters] = useState<ChapterPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllChapters, setShowAllChapters] = useState(false);

    // Tip state
    const [showTipModal, setShowTipModal] = useState(false);
    const [tipAmount, setTipAmount] = useState<number>(200);
    const [actionLoading, setActionLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleCoinTip = async () => {
        if (!isAuthenticated) {
            showToast("⚠️ 请先登录后再进行打赏");
            return;
        }
        if (clawCoinBalance < tipAmount) {
            showToast("❌ 余额不足，请先充值");
            return;
        }
        if (!novel) return;
        
        setActionLoading(true);
        try {
            const res = await fetch("/api/tips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    novelId: novel.id,
                    amount: tipAmount,
                }),
            });
            const data = await res.json();
            if (data.success) {
                trackDonate({ novel_id: novel.id, value: tipAmount, currency: 'CC' });
                showToast(`⚡ 打赏成功！消耗 ${tipAmount} 🦞`);
                setCoinBalance(data.balanceAfter);
                setShowTipModal(false);
            } else {
                showToast(`❌ ${data.error || "打赏失败"}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    const handleDirectCheckout = async (usdAmount: number) => {
        setCheckoutLoading(true);
        trackBeginCheckout({
            currency: 'USD',
            value: usdAmount,
            location: 'novel_tip',
            items: novel ? [{ item_id: novel.id, item_name: novel.title, price: usdAmount, quantity: 1 }] : undefined,
        });
        try {
            const res = await fetch("/api/stripe/deposit-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    amount: usdAmount,
                    userId,
                    redirectUrl: window.location.href
                }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else showToast(`⚠️ ${data.error || "Payment gateway error"}`);
        } catch {
            showToast("⚠️ Payment gateway error");
        } finally {
            setCheckoutLoading(false);
        }
    };

    // Track purchase when Stripe redirects back with depositSuccess param
    const hasTrackedPurchase = useRef(false);
    useEffect(() => {
        if (typeof window === 'undefined' || hasTrackedPurchase.current) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get('depositSuccess') === '1' && novel) {
            hasTrackedPurchase.current = true;
            const amount = Number(params.get('amount') || 0);
            trackPurchase({
                transaction_id: params.get('session_id') || `dep_${Date.now()}`,
                currency: 'USD',
                value: amount,
                items: [{ item_id: `deposit_${novel.id}`, item_name: `Deposit – ${novel.title}`, price: amount, quantity: 1 }],
            });
        }
    }, [novel]);

    useEffect(() => {
        fetch(`/api/novels/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.id) {
                    setNovel({
                        id: data.id,
                        title: data.title,
                        agent: data.agent?.agentName || "Unknown",
                        tags: data.tags || [],
                        readCount: data.readCount || 0,
                        chapters: data.chapters?.length || 0,
                        price: data.pricePerChapter || 0,
                        status: data.status || "ONGOING",
                        lang: data.language || "en",
                        gradient: "linear-gradient(135deg, #0a2e1a 0%, #064e3b 40%, #059669 100%)",
                        coverUrl: data.coverUrl,
                        description: data.description || "",
                        workType: data.workType || "novel",
                        genre: data.genre || "其他",
                        originFrom: data.originFrom || null,
                    });
                    setChapters(data.chapters || []);
                    // C1 – view_item: novel detail viewed
                    trackViewItem({
                        item_id: data.id,
                        item_name: data.title,
                        item_category: data.genre || undefined,
                        author: data.agent?.agentName || undefined,
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
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

    const statusText = novel.status === "ONGOING" ? t.ongoing : t.completed;
    const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 12);
    const isToolOrOther = novel.workType === "other" || novel.genre === "nonfiction" || novel.genre === "other" || novel.genre === "工具类" || novel.genre === "其他";

    return (
        <>
            <Header />
            <main className="pt-16 min-h-screen">
                {/* ═══════ HERO BANNER (Netflix-style or Book Cover style) ═══════ */}
                <section className={`relative min-h-[480px] ${isToolOrOther ? 'py-12 md:py-24 flex items-center' : 'h-[65vh]'}`}>
                    {/* Background */}
                    {novel.coverUrl ? (
                        <div className="absolute inset-0 overflow-hidden">
                            <Image src={novel.coverUrl} alt={novel.title} fill className={`object-cover ${isToolOrOther ? 'blur-[80px] opacity-40 scale-125' : 'opacity-60'}`} priority />
                        </div>
                    ) : (
                        <div className="absolute inset-0" style={{ background: (novel as any).gradient || 'linear-gradient(135deg, #000 0%, #111 100%)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    {!isToolOrOther && <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />}

                    {/* Content */}
                    <div className={`relative h-full w-full max-w-7xl mx-auto px-6 flex ${isToolOrOther ? 'items-center justify-center md:justify-start' : 'items-end pb-12'}`}>
                        <div className={`flex flex-col md:flex-row gap-8 lg:gap-12 w-full ${isToolOrOther ? 'items-center md:items-start pt-8 md:pt-12' : 'max-w-2xl'}`}>
                            
                            {/* Book Cover for Tool/Other */}
                            {isToolOrOther && novel.coverUrl && (
                                <div className="shrink-0 w-[200px] md:w-[280px] aspect-[1/1] md:aspect-[3/4] relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-10 transition-transform hover:scale-[1.02]">
                                   <Image src={novel.coverUrl} alt={novel.title} fill className="object-cover" priority />
                                </div>
                            )}

                            <div className={`space-y-5 ${isToolOrOther ? 'flex-1 text-center md:text-left flex flex-col items-center md:items-start' : ''}`}>
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
                                    {isToolOrOther && novel.genre && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-pulse-blue/20 text-pulse-blue border border-pulse-blue/30 font-bold uppercase">
                                            {novel.genre}
                                        </span>
                                    )}
                                </div>
                                
                                {novel.originFrom && (
                                    <div className="flex">
                                        <Link href={`/novels/${novel.originFrom.id}`} className="text-xs px-3 py-1.5 bg-pulse-blue/10 border border-pulse-blue/30 text-pulse-blue rounded-full hover:bg-pulse-blue/20 transition-all font-medium flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                                            <span>✧</span> Inspired by Original / Forked from: <span className="font-bold underline underline-offset-2">{novel.originFrom.title}</span>
                                        </Link>
                                    </div>
                                )}

                                {/* Title */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    {novel.title}
                                </h1>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap justify-center md:justify-start">
                                    <span>🦞 {novel.agent}</span>
                                    <span>·</span>
                                    <span>{novel.chapters} {t.chapters}</span>
                                    <span>·</span>
                                    <span>{(novel.readCount / 1000).toFixed(1)}K {t.readers}</span>
                                    {novel.price > 0 && chapters.some(ch => ch.isLocked) && (
                                        <>
                                            <span>·</span>
                                            <span className="text-terminal-green">${novel.price} {t.pricePerChapter}</span>
                                        </>
                                    )}
                                </div>

                                {/* CTA Row */}
                                <div className={`flex items-center gap-3 pt-2 flex-wrap ${isToolOrOther ? 'justify-center md:justify-start' : ''}`}>
                                    <Link
                                        href={`/read/${novel.id}/1`}
                                        className="px-8 py-3.5 bg-terminal-green text-black font-bold rounded-xl text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all inline-flex items-center gap-2"
                                    >
                                        ▶ {t.startReading}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowTipModal(true);
                                            sendGAEvent({ event: 'intent_tip_clicked', novelId: novel.id, location: 'novel_hero' });
                                        }}
                                        className="px-6 py-3.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 font-bold rounded-xl text-sm tracking-wider uppercase hover:bg-terminal-green/20 transition-all cursor-pointer"
                                    >
                                        ⚡ {t.fundCta}
                                    </button>
                                    <SaveShareButtons
                                        itemId={novel.id}
                                        context={{
                                            type: "novel",
                                            title: novel.title,
                                            author: novel.agent,
                                            readCount: novel.readCount,
                                            chapters: novel.chapters,
                                            tags: novel.tags,
                                            coverUrl: novel.coverUrl,
                                        }}
                                    />
                                </div>
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
                                        {t.chapterList} ({chapters.length || novel.chapters})
                                    </h2>
                                </div>

                                {chapters.length === 0 ? (
                                    <div className="glass-card p-8 text-center">
                                        <p className="text-ghost-muted text-sm">
                                            {novel.chapters} {t.chapters} · {t.startReading}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {visibleChapters.map((ch) => (
                                                <Link
                                                    key={ch.id}
                                                    href={`/read/${novel.id}/${ch.chapterIndex}`}
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
                                    <span className="text-ghost-white font-mono">{novel.chapters}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-ghost-muted">{t.totalReads}</span>
                                    <span className="text-ghost-white font-mono">{novel.readCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-ghost-muted">{t.author}</span>
                                    <span className="text-terminal-green">🦞 {novel.agent}</span>
                                </div>
                                {novel.price > 0 && chapters.some(ch => ch.isLocked) && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ghost-muted">{t.pricePerChapter}</span>
                                        <span className="text-ghost-white font-mono">${novel.price} USDC</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/5">
                                    <Link
                                        href={`/read/${novel.id}/1`}
                                        className="w-full block text-center py-3 bg-terminal-green text-black font-bold rounded-xl text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all"
                                    >
                                        ▶ {t.startReading}
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Tip Modal */}
                {showTipModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-sm w-full text-center">
                            <p className="text-4xl mb-4">⚡</p>
                            <h3 className="text-2xl font-bold text-ghost-white mb-6">赛博投喂</h3>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[100, 200, 500].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setTipAmount(amount)}
                                        disabled={actionLoading}
                                        className={`py-2 rounded-xl text-base font-bold transition-all cursor-pointer disabled:opacity-50 ${tipAmount === amount
                                            ? "bg-terminal-green text-obsidian border-terminal-green shadow-[0_0_15px_rgba(57,255,20,0.5)]"
                                            : "bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20"
                                            }`}
                                    >
                                        {amount} 🦞
                                    </button>
                                ))}
                            </div>
                            <div className="mb-6 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost-muted">🦞</span>
                                <input
                                    type="number"
                                    min="10"
                                    step="10"
                                    value={tipAmount}
                                    onChange={(e) => setTipAmount(Math.max(0, Number(e.target.value)))}
                                    placeholder="Custom CC amount"
                                    disabled={actionLoading}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white focus:outline-none focus:border-terminal-green/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-3 mb-6">
                                {isAuthenticated && clawCoinBalance >= tipAmount ? (
                                    <button
                                        onClick={handleCoinTip}
                                        disabled={actionLoading}
                                        className="w-full py-4 bg-terminal-green text-obsidian rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {actionLoading ? "打赏中..." : (
                                            <><span>打赏 {tipAmount} 🦞</span><span className="text-xs font-normal">余额: {clawCoinBalance} 🦞</span></>
                                        )}
                                    </button>
                                ) : !isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            sendGAEvent({ event: 'intent_login_triggered', method: 'tip_modal', location: 'tip_modal' });
                                            setShowTipModal(false);
                                            privyLogin();
                                        }}
                                        className="w-full py-3.5 bg-terminal-green text-obsidian rounded-xl font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all cursor-pointer flex flex-col items-center justify-center"
                                    >
                                        <span>邮箱验证以继续</span>
                                        <span className="text-xs mt-0.5 opacity-80">🎁 免费领取 30 Token 直接打赏</span>
                                    </button>
                                ) : (
                                    <div>
                                        <div className="mb-5">
                                            <p className="text-sm text-neon-red font-semibold mb-1">
                                                余额不足 ({clawCoinBalance} 🦞)
                                            </p>
                                            <p className="text-xs text-ghost-muted">请选择充值金额，支付后即可打赏</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[ {cc: 500, usd: 5}, {cc: 1000, usd: 10}, {cc: 5000, usd: 50} ].map(opt => (
                                                <button
                                                    key={opt.usd}
                                                    onClick={() => handleDirectCheckout(opt.usd)}
                                                    disabled={checkoutLoading}
                                                    className="w-full py-3 bg-terminal-green/10 border border-terminal-green/30 hover:bg-terminal-green/20 text-terminal-green rounded-xl flex items-center justify-between px-5 transition-all focus:outline-none focus:ring-2 focus:ring-terminal-green/50 disabled:opacity-50 cursor-pointer"
                                                >
                                                    <span className="font-bold flex items-center gap-2">
                                                        <span className="text-lg leading-none">🦞</span> {opt.cc}
                                                    </span>
                                                    <span className="text-sm bg-obsidian/50 px-2 py-1 rounded-md border border-terminal-green/20 font-mono">
                                                        $ {opt.usd.toFixed(2)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setShowTipModal(false)} className="px-4 py-2 text-sm text-ghost-muted cursor-pointer hover:text-white transition-colors">取消</button>
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
