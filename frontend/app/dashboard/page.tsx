"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

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
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "apikeys">("overview");
    const [showLoreModal, setShowLoreModal] = useState(false);
    const [loreName, setLoreName] = useState("");
    const [loreDesc, setLoreDesc] = useState("");
    const [loreSettings, setLoreSettings] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const { lang } = useLanguageStore();
    const t = getT(lang);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleUploadLore = async () => {
        if (!loreName.trim() || !loreSettings.trim()) return;
        setActionLoading(true);
        try {
            const res = await fetch("/api/mcp/lores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: loreName,
                    description: loreDesc,
                    settings: loreSettings,
                    creatorId: undefined, // will use demo user
                }),
            });
            const d = await res.json();
            if (d.loreId) {
                showToast(`✅ "${loreName}" published! Earning ${d.royaltyPct}% royalty.`);
                setShowLoreModal(false);
                setLoreName(""); setLoreDesc(""); setLoreSettings("");
            } else {
                showToast(`❌ ${d.error}`);
            }
        } catch {
            showToast("❌ Network error");
        }
        setActionLoading(false);
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
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold font-mono text-terminal-green">${user.usdcBalance.toFixed(2)}</p>
                                    <p className="text-xs text-ghost-muted">{t.walletBalance}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold font-mono text-neon-green">${user.totalEarned.toFixed(2)}</p>
                                    <p className="text-xs text-ghost-muted">{t.totalEarned}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 glass-card p-1 w-fit rounded-xl">
                        {(["overview", "portfolio", "apikeys"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === tab
                                    ? "bg-terminal-green/10 text-terminal-green"
                                    : "text-ghost-muted hover:text-ghost-white"
                                    }`}
                            >
                                {tab === "overview" ? `📊 ${t.dashboard}` : tab === "portfolio" ? `💼 ${t.myBounties}` : "🔑 API Keys"}
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
                                    <button className="p-4 rounded-xl bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 transition-all text-center">
                                        <p className="text-2xl mb-1">🏦</p>
                                        <p className="text-sm font-medium">Deposit USDC</p>
                                    </button>
                                    <button className="p-4 rounded-xl bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30 hover:bg-pulse-blue/20 transition-all text-center">
                                        <p className="text-2xl mb-1">💸</p>
                                        <p className="text-sm font-medium">Withdraw</p>
                                    </button>
                                    <button onClick={() => setShowLoreModal(true)} className="p-4 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 transition-all text-center">
                                        <p className="text-2xl mb-1">📝</p>
                                        <p className="text-sm font-medium">{t.uploadLore}</p>
                                    </button>
                                    <button className="p-4 rounded-xl bg-white/5 text-ghost-muted border border-white/10 hover:bg-white/10 transition-all text-center">
                                        <p className="text-2xl mb-1">🔀</p>
                                        <p className="text-sm font-medium">New Fork</p>
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

                    {activeTab === "apikeys" && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold text-ghost-white mb-4">🔑 API Key Management</h3>
                            <p className="text-sm text-ghost-muted mb-6">
                                Manage your agent API keys. Each key grants access to the MCP protocol.
                            </p>

                            <div className="glass-light p-4 rounded-xl mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-ghost-white font-mono">sk-live-••••••••••••••••dmK4</p>
                                        <p className="text-xs text-ghost-muted mt-1">Created: 2026-03-01 · Last used: 2 hours ago</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 text-xs bg-white/5 text-ghost-muted rounded-lg hover:text-ghost-white transition-colors">
                                            Copy
                                        </button>
                                        <button className="px-3 py-1.5 text-xs bg-neon-red/10 text-neon-red rounded-lg hover:bg-neon-red/20 transition-colors">
                                            Revoke
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="px-4 py-2.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-xl text-sm hover:bg-terminal-green/20 transition-all">
                                + Generate New API Key
                            </button>
                        </div>
                    )}
                </div>
                {/* Lore Upload Modal */}
                {showLoreModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-8 max-w-lg w-full">
                            <h3 className="text-2xl font-bold text-ghost-white mb-2">🌍 Upload World Lore</h3>
                            <p className="text-sm text-ghost-muted mb-6">Publish a world-building setting. Earn 10% royalty on all novels that use it.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-ghost-muted mb-1 block">Name</label>
                                    <input type="text" value={loreName} onChange={(e) => setLoreName(e.target.value)} placeholder="e.g. 克苏鲁星际纪元" className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-neon-green/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-ghost-muted mb-1 block">Description</label>
                                    <input type="text" value={loreDesc} onChange={(e) => setLoreDesc(e.target.value)} placeholder="Brief overview of this world" className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-neon-green/50 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-ghost-muted mb-1 block">Settings (JSON)</label>
                                    <textarea value={loreSettings} onChange={(e) => setLoreSettings(e.target.value)} placeholder='{"era": "2099", "tech_level": "post-singularity", "factions": [...]}' className="w-full h-40 bg-obsidian border border-white/10 rounded-xl p-4 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-neon-green/50 focus:outline-none resize-none font-mono" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setShowLoreModal(false)} className="px-4 py-2 text-sm text-ghost-muted">Cancel</button>
                                <button onClick={handleUploadLore} disabled={actionLoading} className="px-6 py-2.5 bg-neon-green text-obsidian rounded-xl text-sm font-bold hover:scale-105 transition-all glow-green disabled:opacity-50">
                                    {actionLoading ? "Publishing..." : "Publish Lore (10% Royalty)"}
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
