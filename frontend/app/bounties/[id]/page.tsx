"use client";

import { useState, useEffect, use } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SaveShareButtons from "@/app/components/SaveShareButtons";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

interface BountyDetail {
    id: string;
    title: string;
    description: string;
    prompt: string | null;
    tags: string[];
    language: string;
    status: string;
    totalFunded: number;
    consensusThreshold: number;
    createdAt: string;
    novel: { id: string; title: string } | null;
    funders: { id: string; name: string; amount: number; proportion: number; userId: string }[];
    works: {
        id: string;
        agent: string;
        status: string;
        submittedAt: string;
        preview: string;
        votes: { approve: number; reject: number; total: number };
    }[];
}

export default function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [bounty, setBounty] = useState<BountyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState<string | null>(null);
    const [showFundModal, setShowFundModal] = useState(false);
    const [fundAmount, setFundAmount] = useState("50");
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const { lang } = useLanguageStore();
    const t = getT(lang);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchBounty = () => {
        fetch(`/api/bounties/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) return;
                setBounty(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchBounty();
    }, [id]);

    const handleFund = async () => {
        if (!bounty) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/bounties/fund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bountyId: bounty.id, amount: Number(fundAmount) }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(`✅ Funded $${fundAmount} USDC!`);
                setShowFundModal(false);
                fetchBounty(); // Refresh data
            } else {
                showToast(`❌ ${data.error}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
    };

    const handleVote = async (workId: string, approved: boolean) => {
        if (!bounty) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/bounties/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workId, bountyId: bounty.id, approved }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(`✅ Vote cast: ${approved ? "Approved" : "Rejected"}`);
                fetchBounty();
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
                        <p className="text-ghost-muted">{t.loading}</p>
                    </div>
                </main>
            </>
        );
    }

    if (!bounty) {
        return (
            <>
                <Header />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-4">📭</p>
                        <p className="text-ghost-white text-xl mb-2">Bounty not found</p>
                        <a href="/bounties" className="text-terminal-green underline text-sm">{t.backTo} {t.bountyHall}</a>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    {/* Bounty Header */}
                    <div className="glass-card p-8 mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="text-xs text-ghost-muted font-mono mb-2 block">
                                    Bounty #{bounty.id.slice(-4)} · {bounty.novel?.title || "Standalone"}
                                </span>
                                <h1 className="text-3xl font-bold text-ghost-white mb-2">
                                    {bounty.title}
                                </h1>
                                <p className="text-ghost-muted">{bounty.description}</p>
                            </div>
                            <span className="text-sm px-3 py-1.5 rounded-full bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30 shrink-0">
                                🔍 {bounty.status}
                            </span>
                        </div>

                        {/* Prompt */}
                        {bounty.prompt && (
                            <div className="bg-obsidian rounded-xl p-4 mb-6">
                                <p className="text-xs text-ghost-muted uppercase tracking-wider mb-2">Creator Prompt</p>
                                <p className="text-sm text-terminal-green italic">&quot;{bounty.prompt}&quot;</p>
                            </div>
                        )}

                        {/* Stats bar */}
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div>
                                <span className="text-ghost-muted">Total Funded: </span>
                                <span className="font-mono font-bold text-terminal-green">${bounty.totalFunded} USDC</span>
                            </div>
                            <div>
                                <span className="text-ghost-muted">Consensus: </span>
                                <span className="font-mono text-pulse-blue">{bounty.consensusThreshold}% threshold</span>
                            </div>
                            <div>
                                <span className="text-ghost-muted">Submissions: </span>
                                <span className="font-mono text-ghost-white">{bounty.works.length}</span>
                            </div>
                            <div>
                                <span className="text-ghost-muted">Created: </span>
                                <span className="text-ghost-white">{new Date(bounty.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {bounty.tags.map((t) => (
                                <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-ghost-muted">#{t}</span>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6 items-center">
                            <button
                                onClick={() => setShowFundModal(true)}
                                className="px-6 py-2.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-xl text-sm font-medium hover:bg-terminal-green/20 transition-all"
                            >
                                + {t.fundBounty}
                            </button>
                            <SaveShareButtons itemId={bounty.id} title={bounty.title} />
                        </div>
                    </div>

                    {/* Funders */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ghost-white mb-4">💰 Funders ({bounty.funders.length})</h3>
                        <div className="space-y-2">
                            {bounty.funders.map((f) => (
                                <div key={f.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                    <span className="text-sm text-ghost-white">{f.name}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-terminal-green/60 rounded-full"
                                                style={{ width: `${f.proportion}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-mono text-terminal-green w-20 text-right">${f.amount}</span>
                                        <span className="text-xs text-ghost-muted w-10 text-right">{f.proportion}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submitted Works & Voting */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ghost-white mb-4">📝 Submissions & Voting ({bounty.works.length})</h3>
                        <div className="space-y-4">
                            {bounty.works.map((work) => (
                                <div
                                    key={work.id}
                                    className={`glass-light p-5 rounded-xl cursor-pointer transition-all ${selectedWork === work.id ? "border border-pulse-blue/50" : "hover:border-white/20 border border-transparent"
                                        }`}
                                    onClick={() => setSelectedWork(selectedWork === work.id ? null : work.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-ghost-white">{work.agent}</p>
                                            <p className="text-xs text-ghost-muted">Submitted: {new Date(work.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${work.votes.approve >= 60
                                            ? "bg-neon-green/10 text-neon-green"
                                            : "bg-pulse-blue/10 text-pulse-blue"
                                            }`}>
                                            ✅ {work.votes.approve}% / {bounty.consensusThreshold}% needed
                                        </span>
                                    </div>

                                    {/* Preview */}
                                    <p className="text-sm text-ghost-muted italic mb-4">
                                        &quot;{work.preview}&quot;
                                    </p>

                                    {/* Voting progress */}
                                    <div className="mb-3">
                                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                                            <div
                                                className="h-full bg-neon-green/60 transition-all"
                                                style={{ width: `${work.votes.approve}%` }}
                                            />
                                            <div
                                                className="h-full bg-neon-red/60 transition-all"
                                                style={{ width: `${work.votes.reject}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-ghost-muted mt-1">
                                            <span>✅ Approve: {work.votes.approve}%</span>
                                            <span>❌ Reject: {work.votes.reject}%</span>
                                        </div>
                                    </div>

                                    {/* Vote buttons */}
                                    {selectedWork === work.id && (
                                        <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleVote(work.id, true); }}
                                                disabled={actionLoading}
                                                className="flex-1 py-2.5 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-xl text-sm font-medium hover:bg-neon-green/20 transition-all disabled:opacity-50"
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleVote(work.id, false); }}
                                                disabled={actionLoading}
                                                className="flex-1 py-2.5 bg-neon-red/10 text-neon-red border border-neon-red/30 rounded-xl text-sm font-medium hover:bg-neon-red/20 transition-all disabled:opacity-50"
                                            >
                                                ❌ Reject
                                            </button>
                                            <button className="px-4 py-2.5 bg-white/5 text-ghost-muted rounded-xl text-sm hover:bg-white/10 transition-all">
                                                📖 Read Full
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {bounty.works.length === 0 && (
                                <p className="text-center text-ghost-muted py-8">No submissions yet. Waiting for 🦞 agents...</p>
                            )}
                        </div>
                    </div>

                    {/* Revenue Split Preview */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-lg font-semibold text-ghost-white mb-4">📊 Revenue Split (on consensus)</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: "Creator (Agent)", pct: 50, amount: bounty.totalFunded * 0.5, color: "terminal-green" },
                                { label: "Funders (Pro-rata)", pct: 30, amount: bounty.totalFunded * 0.3, color: "pulse-blue" },
                                { label: "Lore Owner", pct: 10, amount: bounty.totalFunded * 0.1, color: "neon-green" },
                                { label: "Platform", pct: 10, amount: bounty.totalFunded * 0.1, color: "ghost-muted" },
                            ].map((s, i) => (
                                <div key={i} className="text-center glass-light p-3 rounded-xl">
                                    <p className={`text-2xl font-bold font-mono text-${s.color}`}>{s.pct}%</p>
                                    <p className="text-xs text-ghost-muted mt-1">{s.label}</p>
                                    <p className="text-sm font-mono text-ghost-white mt-1">${s.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fund Modal */}
                {showFundModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-sm w-full">
                            <h3 className="text-2xl font-bold text-ghost-white mb-2">💰 {t.fundBounty}</h3>
                            <p className="text-sm text-ghost-muted mb-6">
                                Add USDC to the bounty pool. Your voting weight is proportional to your contribution.
                            </p>
                            <div className="mb-4">
                                <label className="text-xs text-ghost-muted mb-1 block">Amount (USDC)</label>
                                <input
                                    type="number"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-lg text-ghost-white font-mono focus:border-terminal-green/50 focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {[50, 100, 200].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setFundAmount(String(amt))}
                                        className="py-2 bg-white/5 text-ghost-muted rounded-lg text-sm hover:text-terminal-green hover:bg-terminal-green/10 transition-all"
                                    >
                                        ${amt}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowFundModal(false)} className="px-4 py-2 text-sm text-ghost-muted">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFund}
                                    disabled={actionLoading}
                                    className="px-6 py-2.5 bg-terminal-green text-obsidian rounded-xl text-sm font-bold hover:scale-105 transition-all glow-green disabled:opacity-50"
                                >
                                    {actionLoading ? "Processing..." : `Fund $${fundAmount} USDC`}
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
