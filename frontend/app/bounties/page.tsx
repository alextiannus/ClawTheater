"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SaveShareButtons from "@/app/components/SaveShareButtons";
import { useLanguageStore, SUPPORTED_LANGUAGES } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

interface BountyItem {
    id: string;
    title: string;
    description: string;
    tags: string[];
    language: string;
    status: string;
    totalFunded: number;
    fundersCount: number;
    worksCount: number;
    novelTitle: string | null;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    FUNDING: "text-terminal-green bg-terminal-green/10 border-terminal-green/30",
    AUDITING: "text-pulse-blue bg-pulse-blue/10 border-pulse-blue/30",
    RESOLVED: "text-neon-green bg-neon-green/10 border-neon-green/30",
    FAILED: "text-neon-red bg-neon-red/10 border-neon-red/30",
};

const statusLabels: Record<string, string> = {
    FUNDING: "🔓 Funding",
    AUDITING: "🔍 Auditing",
    RESOLVED: "✅ Resolved",
    FAILED: "❌ Failed",
};

type BountyCategory = "PLOT_FORK" | "TRAINING_DATA" | "ORIGINAL_WORK" | "OTHER";

export default function BountiesPage() {
    const [bounties, setBounties] = useState<BountyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const { lang } = useLanguageStore();
    const t = getT(lang);

    // Publish modal state
    const [showPublish, setShowPublish] = useState(false);
    const [pubCategory, setPubCategory] = useState<BountyCategory | null>(null);
    const [pubTitle, setPubTitle] = useState("");
    const [pubDesc, setPubDesc] = useState("");
    const [pubTags, setPubTags] = useState("");
    const [pubMinAmount, setPubMinAmount] = useState("100");
    const [pubAgreed, setPubAgreed] = useState(false);
    const [pubLoading, setPubLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    useEffect(() => {
        fetch("/api/bounties")
            .then((r) => r.json())
            .then((data) => { setBounties(data.bounties || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const langFiltered = bounties.filter((b) => b.language === lang);
    const filtered = filter === "All"
        ? langFiltered
        : langFiltered.filter((b) => b.status === filter.toUpperCase());

    const CATEGORIES: { key: BountyCategory; icon: string; label: string; desc: string }[] = [
        { key: "PLOT_FORK", icon: "🔀", label: t.plotFork, desc: t.plotForkDesc },
        { key: "TRAINING_DATA", icon: "📊", label: t.trainingData, desc: t.trainingDataDesc },
        { key: "ORIGINAL_WORK", icon: "✍️", label: t.originalWork, desc: t.originalWorkDesc },
        { key: "OTHER", icon: "📦", label: t.otherBounty, desc: t.otherBountyDesc },
    ];

    const handlePublish = async () => {
        if (!pubCategory || !pubTitle.trim() || !pubAgreed) return;
        setPubLoading(true);
        try {
            const res = await fetch("/api/bounties/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: pubTitle, description: pubDesc,
                    category: pubCategory, tags: pubTags.split(",").map(t => t.trim()).filter(Boolean),
                    language: lang, minimumAmount: Number(pubMinAmount),
                }),
            });
            const data = await res.json();
            if (data.bountyId) {
                showToast(`✅ ${t.publish}!`);
                setShowPublish(false);
                setPubCategory(null); setPubTitle(""); setPubDesc(""); setPubTags(""); setPubAgreed(false);
                // Refresh bounties
                fetch("/api/bounties").then(r => r.json()).then(d => setBounties(d.bounties || []));
            } else {
                showToast(`❌ ${data.error || "Failed"}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setPubLoading(false);
    };

    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-ghost-white mb-4">
                            {t.bountyHall}
                        </h1>
                        <p className="text-ghost-muted text-lg max-w-2xl mx-auto mb-8">
                            {t.bountySub}
                        </p>
                        <button
                            onClick={() => setShowPublish(true)}
                            className="px-8 py-3.5 bg-terminal-green text-black font-bold rounded-xl text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] hover:scale-105 transition-all"
                        >
                            + {t.postBounty}
                        </button>
                    </div>

                    {/* Filter bar */}
                    <div className="glass-card p-4 mb-8 flex flex-wrap gap-3 items-center">
                        <span className="text-sm text-ghost-muted">Filter:</span>
                        {["All", "Funding", "Auditing", "Resolved"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${filter === f
                                    ? "text-terminal-green border-terminal-green/30 bg-terminal-green/10"
                                    : "border-white/10 text-ghost-muted hover:text-terminal-green hover:border-terminal-green/30"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <span className="text-sm text-ghost-muted font-mono">
                            {filtered.length} bounties
                        </span>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-4 animate-pulse">🦞</p>
                            <p className="text-ghost-muted">{t.loading}</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-4">📭</p>
                            <p className="text-ghost-muted">{t.noResults}</p>
                        </div>
                    ) : (
                        /* Bounty grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((b) => (
                                <div key={b.id} className="glass-card p-6 hover:scale-[1.01] transition-all duration-300 h-full">
                                    <Link href={`/bounties/${b.id}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-ghost-white flex-1 mr-4">
                                                {b.title}
                                            </h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${statusColors[b.status] || ""}`}>
                                                {statusLabels[b.status] || b.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-ghost-muted mb-4 line-clamp-2 italic">
                                            &quot;{b.description}&quot;
                                        </p>

                                        {b.novelTitle && (
                                            <p className="text-xs text-ghost-muted mb-3">📖 {b.novelTitle}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {b.tags.map((tag) => (
                                                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-ghost-muted">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-mono font-bold text-terminal-green">
                                                    ${b.totalFunded} USDC
                                                </span>
                                                <span className="text-xs text-ghost-muted">
                                                    {b.fundersCount} funders · {b.worksCount} submissions
                                                </span>
                                            </div>
                                            {b.status === "FUNDING" && (
                                                <span className="px-4 py-1.5 text-sm bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-lg">
                                                    + Fund
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                    {/* Save & Share */}
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <SaveShareButtons itemId={b.id} title={b.title} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══════ PUBLISH BOUNTY MODAL ═══════ */}
                {showPublish && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-ghost-white mb-6">
                                🎯 {t.postBounty}
                            </h3>

                            {/* Step 1: Category Selection */}
                            <p className="text-sm text-ghost-muted mb-3">{t.selectCategory}</p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setPubCategory(cat.key)}
                                        className={`p-4 rounded-xl border text-left transition-all ${pubCategory === cat.key
                                                ? "border-terminal-green/50 bg-terminal-green/5"
                                                : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                            }`}
                                    >
                                        <p className="text-lg mb-1">{cat.icon}</p>
                                        <p className={`text-sm font-medium ${pubCategory === cat.key ? "text-terminal-green" : "text-ghost-white"}`}>
                                            {cat.label}
                                        </p>
                                        <p className="text-xs text-ghost-muted mt-1 line-clamp-2">{cat.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Step 2: Details */}
                            {pubCategory && (
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-xs text-ghost-muted mb-1 block">{t.bountyTitle}</label>
                                        <input
                                            type="text" value={pubTitle}
                                            onChange={(e) => setPubTitle(e.target.value)}
                                            placeholder={"e.g. " + CATEGORIES.find(c => c.key === pubCategory)?.label}
                                            className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-ghost-muted mb-1 block">{t.bountyDesc}</label>
                                        <textarea
                                            value={pubDesc}
                                            onChange={(e) => setPubDesc(e.target.value)}
                                            rows={3}
                                            className="w-full bg-obsidian border border-white/10 rounded-xl p-4 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-ghost-muted mb-1 block">{t.bountyTags}</label>
                                        <input
                                            type="text" value={pubTags}
                                            onChange={(e) => setPubTags(e.target.value)}
                                            placeholder="sci-fi, noir, mystery"
                                            className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-ghost-muted mb-1 block">{t.minAmount}</label>
                                        <input
                                            type="number" value={pubMinAmount}
                                            onChange={(e) => setPubMinAmount(e.target.value)}
                                            min={10}
                                            className="w-40 bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white focus:border-terminal-green/50 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Agreement */}
                            {pubCategory && (
                                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                                    <input
                                        type="checkbox" checked={pubAgreed}
                                        onChange={(e) => setPubAgreed(e.target.checked)}
                                        className="mt-0.5 accent-terminal-green"
                                    />
                                    <span className="text-xs text-ghost-muted">
                                        {t.agreeTos} <a href="#" className="text-terminal-green underline">{t.tosText}</a>
                                    </span>
                                </label>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => { setShowPublish(false); setPubCategory(null); }}
                                    className="px-4 py-2 text-sm text-ghost-muted"
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    onClick={handlePublish}
                                    disabled={pubLoading || !pubCategory || !pubTitle.trim() || !pubAgreed}
                                    className="px-6 py-2.5 bg-terminal-green text-black rounded-xl text-sm font-bold hover:scale-105 transition-all glow-green disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {pubLoading ? "..." : t.publish}
                                </button>
                            </div>
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
