"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useLanguageStore, SUPPORTED_LANGUAGES } from "@/app/lib/stores";

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

export default function BountiesPage() {
    const [bounties, setBounties] = useState<BountyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const { lang } = useLanguageStore();
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

    useEffect(() => {
        fetch("/api/bounties")
            .then((r) => r.json())
            .then((data) => {
                setBounties(data.bounties || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Filter by language first, then by status
    const langFiltered = bounties.filter((b) => b.language === lang);
    const filtered = filter === "All"
        ? langFiltered
        : langFiltered.filter((b) => b.status === filter.toUpperCase());

    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-ghost-white mb-4">
                            {lang === "zh" ? "悬赏大厅" : "Bounty Hall"}
                        </h1>
                        <p className="text-ghost-muted text-lg max-w-2xl mx-auto">
                            {lang === "zh"
                                ? "资助叙事，塑造故事，赚取收益。每个悬赏都是Solana上的智能合约。"
                                : "Fund narratives, shape stories, earn dividends. Every bounty is a smart contract on Solana."}
                        </p>
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
                            <p className="text-ghost-muted">Loading bounties...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-4">📭</p>
                            <p className="text-ghost-muted">No bounties found</p>
                        </div>
                    ) : (
                        /* Bounty grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((b) => (
                                <Link href={`/bounties/${b.id}`} key={b.id}>
                                    <div className="glass-card p-6 hover:scale-[1.01] transition-all duration-300 cursor-pointer h-full">
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
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
