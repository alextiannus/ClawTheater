"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SaveShareButtons from "@/app/components/SaveShareButtons";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";
import { Wallet, CreditCard } from "lucide-react";

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

    const [novel, setNovel] = useState<NovelDetail | null>(null);
    const [chapters, setChapters] = useState<ChapterPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllChapters, setShowAllChapters] = useState(false);

    // Tip state
    const [showTipModal, setShowTipModal] = useState(false);
    const [tipAmount, setTipAmount] = useState<number>(50);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleStripeTip = async () => {
        if (!novel) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/stripe/tip-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: tipAmount,
                    chapterId: "novel-tip",
                    novelId: novel.id,
                    chapterTitle: `Novel: ${novel.title}`,
                    userId: "anonymous",
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
        setActionLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showToast("⚡ 钱包打赏成功！感谢支持！(Simulated)");
            setShowTipModal(false);
        } catch {
            showToast("❌ 钱包支付失败");
        }
        setActionLoading(false);
    };

    useEffect(() => {
        // Fetch specific novel from the API list (or we can use a dedicated endpoint)
        fetch(`/api/novels`)
            .then((r) => r.json())
            .then((data) => {
                const found = (data.novels || []).find((n: any) => n.id === id);
                if (found) {
                    setNovel({
                        id: found.id,
                        title: found.title,
                        agent: found.agent || "Unknown",
                        tags: found.tags || [],
                        readCount: found.readCount || 0,
                        chapters: found.chapterCount || 0,
                        price: found.price || 0,
                        status: found.status || "ONGOING",
                        lang: found.language || "en",
                        gradient: found.gradient || "linear-gradient(135deg, #0a2e1a 0%, #064e3b 40%, #059669 100%)",
                        coverUrl: found.coverUrl,
                        description: found.description || "",
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Fetch chapters
        fetch(`/api/novels/${id}/chapters`)
            .then((r) => r.json())
            .then((data) => {
                setChapters(data.chapters || []);
                if (data.novel && data.novel.totalChapters !== undefined) {
                    setNovel(prev => prev ? { ...prev, chapters: data.novel.totalChapters } : null);
                }
            })
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

    const statusText = novel.status === "ONGOING" ? t.ongoing : t.completed;
    const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 12);

    return (
        <>
            <Header />
            <main className="pt-16 min-h-screen">
                {/* ═══════ HERO BANNER (Netflix-style) ═══════ */}
                <section className="relative h-[65vh] min-h-[480px] overflow-hidden">
                    {/* Background */}
                    {(novel as any).coverUrl ? (
                        <div className="absolute inset-0">
                            <Image src={(novel as any).coverUrl} alt={novel.title} fill className="object-cover opacity-60" priority />
                        </div>
                    ) : (
                        <div className="absolute inset-0" style={{ background: (novel as any).gradient || 'linear-gradient(135deg, #000 0%, #111 100%)' }} />
                    )}
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
                                <span>{novel.chapters} {t.chapters}</span>
                                <span>·</span>
                                <span>{(novel.readCount / 1000).toFixed(1)}K {t.readers}</span>
                                {novel.price > 0 && (
                                    <>
                                        <span>·</span>
                                        <span className="text-terminal-green">${novel.price} {t.pricePerChapter}</span>
                                    </>
                                )}
                            </div>

                            {/* CTA Row */}
                            <div className="flex items-center gap-3 pt-2">
                                <Link
                                    href={`/read/${novel.id}/1`}
                                    className="px-8 py-3.5 bg-terminal-green text-black font-bold rounded-xl text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all inline-flex items-center gap-2"
                                >
                                    ▶ {t.startReading}
                                </Link>
                                <button
                                    onClick={() => setShowTipModal(true)}
                                    className="px-6 py-3.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 font-bold rounded-xl text-sm tracking-wider uppercase hover:bg-terminal-green/20 transition-all cursor-pointer"
                                >
                                    ⚡ {t.fundCta}
                                </button>
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
                                {novel.price > 0 && (
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
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[10, 50, 100].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setTipAmount(amount)}
                                        disabled={actionLoading}
                                        className={`py-3 rounded-xl text-lg font-bold transition-all cursor-pointer disabled:opacity-50 ${tipAmount === amount
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
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    <CreditCard size={18} /> Pay Cash
                                </button>
                                {/* <button
                                    onClick={handleWalletTip}
                                    disabled={actionLoading}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    <Wallet size={18} /> Pay with Wallet
                                </button> */}
                            </div>
                            <button onClick={() => setShowTipModal(false)} className="px-4 py-2 text-sm text-ghost-muted cursor-pointer hover:text-white transition-colors">Cancel</button>
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
