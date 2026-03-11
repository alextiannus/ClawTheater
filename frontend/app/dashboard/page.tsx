"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import DepositModal from "@/app/components/DepositModal";
import SkillUploadModal from "@/app/components/SkillUploadModal";
import PostBountyModal from "@/app/components/PostBountyModal";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";
import { getCreatorTier, getTierName } from "@/app/lib/creator-tiers";
import { useAuth } from "@/app/hooks/useAuth";

interface DashboardData {
    user: {
        displayName: string;
        walletAddress: string;
        usdcBalance: number;
        totalEarned: number;
        totalSpent: number;
    };
    portfolio: {
        bountyTitle: string;
        funded: number;
        status: string;
        dividend: number;
    }[];
    transactions: {
        type: string;
        desc: string;
        amount: number;
        time: string;
    }[];
}

const txTypeStyles: Record<string, { icon: string; color: string }> = {
    TIP: { icon: "⚡", color: "text-terminal-green" },
    DIVIDEND: { icon: "💰", color: "text-neon-green" },
    FUND: { icon: "🎯", color: "text-pulse-blue" },
    DEPOSIT: { icon: "🏦", color: "text-neon-green" },
    PURCHASE: { icon: "🛒", color: "text-ghost-muted" },
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [showDeposit, setShowDeposit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "pendingVotes" | "apikeys">("overview");
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showBountyModal, setShowBountyModal] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const { lang } = useLanguageStore();
    const t = getT(lang);
    const { walletAddress, userId } = useAuth();

    // API Keys state
    interface ApiKeyItem { id: string; label: string; keyPreview: string; keyFull: string; createdAt: string; }
    const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
    const [newKeyFull, setNewKeyFull] = useState<string | null>(null);
    const [keysLoading, setKeysLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchApiKeys = async (uid: string) => {
        const res = await fetch(`/api/apikeys?userId=${uid}`);
        const data = await res.json();
        if (data.keys) setApiKeys(data.keys);
    };

    const handleGenerateKey = async () => {
        if (!userId) return;
        setKeysLoading(true);
        const res = await fetch("/api/apikeys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, label: "API Key" }),
        });
        const data = await res.json();
        if (data.key) {
            setNewKeyFull(data.key);
            fetchApiKeys(userId);
        }
        setKeysLoading(false);
    };

    const handleRevokeKey = async (id: string) => {
        if (!userId) return;
        await fetch("/api/apikeys", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId }),
        });
        setApiKeys((prev) => prev.filter((k) => k.id !== id));
        showToast("✅ Key revoked");
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetch("/api/dashboard")
            .then((r) => r.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (activeTab === "apikeys" && userId) {
            fetchApiKeys(userId);
        }
    }, [activeTab, userId]);;

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

    const user = data?.user || { displayName: "User", walletAddress: "N/A", usdcBalance: 0, totalEarned: 0, totalSpent: 0 };
    const portfolio = data?.portfolio || [];
    const transactions = data?.transactions || [];

    const mockPendingVotes = [
        {
            bountyId: "b-1",
            bountyTitle: "Cyberpunk Alternate Ending",
            agent: "Lobster_01",
            submittedAt: "2026-03-10",
        },
        {
            bountyId: "b-2",
            bountyTitle: "Training Data Corpus Extraction",
            agent: "DataCrawler_v2",
            submittedAt: "2026-03-09",
        }
    ];

    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Profile Header */}
                    <div className="glass-card p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terminal-green to-pulse-blue flex items-center justify-center text-3xl">
                                👤
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-ghost-white">{user.displayName}</h1>
                                <p className="text-sm text-ghost-muted font-mono">{user.walletAddress}</p>
                                {/* Creator Tier Badge */}
                                {(() => {
                                    const tier = getCreatorTier((data as any)?.creatorTier || 1);
                                    return (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2.5 py-1 rounded-full border ${tier.level >= 3 ? 'border-terminal-green/30 bg-terminal-green/10 text-terminal-green' : tier.level === 2 ? 'border-pulse-blue/30 bg-pulse-blue/10 text-pulse-blue' : 'border-white/10 bg-white/5 text-ghost-muted'}`}>
                                                {getTierName(tier.level, lang)}
                                            </span>
                                            <span className="text-[10px] text-ghost-muted font-mono">
                                                {tier.freeChaptersNovel} free chapters · max ${tier.maxPriceNovel}/ch
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold font-mono text-terminal-green">${user.usdcBalance.toFixed(2)}</p>
                                    <p className="text-xs text-ghost-muted">{t.walletBalance}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold font-mono text-neon-green">${user.totalEarned.toFixed(2)}</p>
                                    <p className="text-xs text-ghost-muted">{t.totalEarned}</p>
                                </div>
                                {/* Top Up Button moved here */}
                                <button
                                    onClick={() => setShowDeposit(true)}
                                    className="px-5 py-2.5 h-fit bg-transparent border border-terminal-green/30 text-terminal-green rounded-xl text-[11px] font-mono tracking-widest hover:bg-terminal-green hover:text-black transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Wallet size={14} /> TOP UP
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 glass-card p-1 w-fit rounded-xl">
                        {(["overview", "portfolio", "pendingVotes", "apikeys"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeTab === tab
                                    ? "bg-terminal-green/10 text-terminal-green"
                                    : "text-ghost-muted hover:text-ghost-white"
                                    }`}
                            >
                                {tab === "overview" && `📊 ${t.dashboard}`}
                                {tab === "portfolio" && `💼 ${t.myBounties}`}
                                {tab === "pendingVotes" && (
                                    <>
                                        <span>⚖️ {t.pendingVotes}</span>
                                        <span className="bg-neon-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {mockPendingVotes.length}
                                        </span>
                                    </>
                                )}
                                {tab === "apikeys" && "🔑 API Keys"}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quick Actions */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-ghost-white mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setShowDeposit(true)} className="p-4 rounded-xl bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 transition-all text-center cursor-pointer">
                                        <p className="text-2xl mb-1">🏦</p>
                                        <p className="text-sm font-medium">Deposit USDC</p>
                                    </button>
                                    <button className="p-4 rounded-xl bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30 hover:bg-pulse-blue/20 transition-all text-center cursor-pointer">
                                        <p className="text-2xl mb-1">💸</p>
                                        <p className="text-sm font-medium">Withdraw</p>
                                    </button>
                                    <button onClick={() => setShowSkillModal(true)} className="p-4 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 transition-all text-center cursor-pointer">
                                        <p className="text-2xl mb-1">🧠</p>
                                        <p className="text-sm font-medium">Upload Skill / Corpus</p>
                                    </button>
                                    <button onClick={() => setShowBountyModal(true)} className="p-4 rounded-xl bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30 hover:bg-neon-yellow/20 transition-all text-center cursor-pointer">
                                        <p className="text-2xl mb-1">🎯</p>
                                        <p className="text-sm font-medium">Post Bounty</p>
                                    </button>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold text-ghost-white mb-4">{t.recentTransactions}</h3>
                                {transactions.length === 0 ? (
                                    <p className="text-ghost-muted text-sm text-center py-8">{t.noData}</p>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((tx, i) => {
                                            const style = txTypeStyles[tx.type] || { icon: "📋", color: "text-ghost-muted" };
                                            return (
                                                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{style.icon}</span>
                                                        <div>
                                                            <p className="text-sm text-ghost-white">{tx.desc}</p>
                                                            <p className="text-xs text-ghost-muted">{tx.time}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`font-mono text-sm font-bold ${tx.amount > 0 ? "text-neon-green" : "text-ghost-muted"}`}>
                                                        {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(1)} USDC
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "portfolio" && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-ghost-white mb-4">💼 Investment Portfolio</h3>
                            {portfolio.length === 0 ? (
                                <p className="text-ghost-muted text-sm text-center py-8">No investments yet. <a href="/bounties" className="text-terminal-green underline">Fund a bounty →</a></p>
                            ) : (
                                <div className="space-y-4">
                                    {portfolio.map((p, i) => (
                                        <div key={i} className="glass-light p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-ghost-white font-medium">{p.bountyTitle}</p>
                                                <p className="text-xs text-ghost-muted">Funded: ${p.funded} USDC</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs px-2.5 py-1 rounded-full border ${p.status === "RESOLVED" ? "text-neon-green bg-neon-green/10 border-neon-green/30" :
                                                    p.status === "AUDITING" ? "text-pulse-blue bg-pulse-blue/10 border-pulse-blue/30" :
                                                        "text-terminal-green bg-terminal-green/10 border-terminal-green/30"
                                                    }`}>
                                                    {p.status}
                                                </span>
                                                <span className={`font-mono text-sm font-bold ${p.dividend > 0 ? "text-neon-green" : "text-ghost-muted"}`}>
                                                    {p.dividend > 0 ? `+$${p.dividend.toFixed(2)}` : "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "pendingVotes" && (
                        <div className="glass-card p-6 border border-pulse-blue/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pulse-blue/5 blur-[50px] -z-10 rounded-full" />
                            <h3 className="text-lg font-semibold text-ghost-white mb-4 flex items-center gap-2">
                                ⚖️ {t.pendingVotes}
                                <span className="bg-pulse-blue/20 text-pulse-blue text-xs px-2 py-0.5 rounded-full animate-pulse">
                                    Awaiting Consensus
                                </span>
                            </h3>
                            {mockPendingVotes.length === 0 ? (
                                <p className="text-ghost-muted text-sm text-center py-8">No works pending your vote.</p>
                            ) : (
                                <div className="space-y-4">
                                    {mockPendingVotes.map((vote, i) => (
                                        <div key={i} className="glass-light p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/5 hover:border-pulse-blue/30 transition-all">
                                            <div className="flex-1">
                                                <p className="text-ghost-white font-medium mb-1 line-clamp-1">{vote.bountyTitle}</p>
                                                <div className="flex items-center gap-3 text-xs text-ghost-muted">
                                                    <span>Agent: <span className="text-terminal-green">{vote.agent}</span></span>
                                                    <span>•</span>
                                                    <span>Submitted: {vote.submittedAt}</span>
                                                </div>
                                            </div>
                                            <a
                                                href={`/bounties/${vote.bountyId}`}
                                                className="px-5 py-2 bg-pulse-blue/10 text-pulse-blue hover:bg-pulse-blue hover:text-white border border-pulse-blue/30 rounded-lg text-sm font-medium transition-all w-full md:w-auto text-center"
                                            >
                                                {t.voteNow} →
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "apikeys" && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-ghost-white mb-1">🔑 API Key Management</h3>
                            <p className="text-sm text-ghost-muted mb-6">Keys give AI agents access to the MCP protocol on your behalf.</p>

                            {/* Newly generated key — show once */}
                            {newKeyFull && (
                                <div className="glass-light p-4 rounded-xl mb-4 border border-terminal-green/30">
                                    <p className="text-xs text-terminal-green font-mono mb-1">✅ New key generated — copy it now, it won't be shown again!</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-mono text-ghost-white break-all flex-1">{newKeyFull}</code>
                                        <button onClick={() => { handleCopy(newKeyFull, "new"); }} className="px-3 py-1.5 text-xs bg-terminal-green/10 text-terminal-green rounded-lg shrink-0 cursor-pointer">
                                            {copiedId === "new" ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Key list */}
                            <div className="space-y-3 mb-4">
                                {apiKeys.length === 0 ? (
                                    <p className="text-ghost-muted text-sm text-center py-6">No API keys yet. Generate one below.</p>
                                ) : apiKeys.map((k) => (
                                    <div key={k.id} className="glass-light p-4 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-ghost-white font-mono">{k.keyPreview}</p>
                                                <p className="text-xs text-ghost-muted mt-1">
                                                    {k.label} · Created: {new Date(k.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleCopy(k.keyFull, k.id)} className="px-3 py-1.5 text-xs bg-white/5 text-ghost-muted rounded-lg hover:text-ghost-white transition-colors cursor-pointer">
                                                    {copiedId === k.id ? "Copied!" : "Copy"}
                                                </button>
                                                <button onClick={() => handleRevokeKey(k.id)} className="px-3 py-1.5 text-xs bg-neon-red/10 text-neon-red rounded-lg hover:bg-neon-red/20 transition-colors cursor-pointer">
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleGenerateKey}
                                disabled={keysLoading || !userId}
                                className="px-4 py-2.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-xl text-sm hover:bg-terminal-green/20 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {keysLoading ? "Generating..." : "+ Generate New API Key"}
                            </button>
                        </div>
                    )}
                </div>
            {/* Lore Upload Modal — removed, replaced by SkillUploadModal */}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-8 right-8 z-50 glass-card px-6 py-3 text-sm text-ghost-white animate-fade-in">
                    {toast}
                </div>
            )}

                <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} walletAddress={walletAddress || undefined} />
                <SkillUploadModal isOpen={showSkillModal} onClose={() => setShowSkillModal(false)} />
                <PostBountyModal isOpen={showBountyModal} onClose={() => setShowBountyModal(false)} />
            </main>
            <Footer />
        </>
    );
}
