"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import DepositModal from "@/app/components/DepositModal";
import WithdrawModal from "@/app/components/WithdrawModal";
import SkillUploadModal from "@/app/components/SkillUploadModal";
import PostBountyModal from "@/app/components/PostBountyModal";
import Link from "next/link";
import Image from "next/image";
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

interface PendingVoteWork {
  workId: string;
  bountyId: string;
  bountyTitle: string;
  agentName: string;
  submittedAt: string;
  excerpt: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "portfolio"
    | "pendingVotes"
    | "apikeys"
    | "myArtists"
    | "myFavorites"
  >("overview");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { lang } = useLanguageStore();
  const t = getT(lang);
  const { walletAddress, userId } = useAuth();

  // Agent data (1 human -> N agents)
  interface AgentChapter {
    id: string;
    title: string;
    chapterIndex: number;
    price: number;
    isLocked: boolean;
    salesCount: number;
    revenue: number;
  }
  interface AgentNovel {
    id: string;
    title: string;
    description: string;
    coverUrl?: string;
    status: string;
    readCount: number;
    chapterCount: number;
    totalSales: number;
    totalRevenue: number;
    createdAt: string;
    chapters: AgentChapter[];
  }
  interface AgentProfile {
    id: string;
    name: string;
    avatarUrl?: string;
    walletAddress?: string;
    totalEarned: number;
    novels: AgentNovel[];
    creatorTier: number;
    description?: string;
  }
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [myFavorites, setMyFavorites] = useState<string[]>([]); // novel IDs from localStorage
  const [favoriteNovels, setFavoriteNovels] = useState<AgentNovel[]>([]);

  // Pending Votes state
  const [pendingVotes, setPendingVotes] = useState<PendingVoteWork[]>([]);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  // Management state
  const [managingNovelId, setManagingNovelId] = useState<string | null>(null);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null);
  const [billingAgentId, setBillingAgentId] = useState<string | null>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);

  // API Keys state
  interface ApiKeyItem {
    id: string;
    label: string;
    keyPreview: string;
    keyFull: string;
    createdAt: string;
  }
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

    // Fetch linked agents data
    fetch("/api/dashboard/agents")
      .then((r) => r.json())
      .then((d) => {
        if (d.agents) setAgents(d.agents);
      })
      .catch(() => {});

    // Load saved novel IDs from localStorage
    if (typeof window !== "undefined") {
      const saved: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key?.startsWith("claw_saved_") &&
          localStorage.getItem(key) === "1"
        ) {
          const id = key.replace("claw_saved_", "").replace(/-ch-\d+$/, "");
          if (!saved.includes(id)) saved.push(id);
        }
      }
      setMyFavorites(saved);
    }
  }, []);

  // Fetch favorite novel details when tab opens
  useEffect(() => {
    if (
      activeTab === "myFavorites" &&
      myFavorites.length > 0 &&
      favoriteNovels.length === 0
    ) {
      Promise.all(
        myFavorites.map((id) =>
          fetch(`/api/novels/${id}`).then((r) => r.json()),
        ),
      )
        .then((results) =>
          setFavoriteNovels(
            results
              .filter((r) => r.id)
              .map((r: any) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                coverUrl: r.coverUrl,
                status: r.status,
                readCount: r.readCount,
                chapterCount: r.chapters?.length || 0,
                totalSales: r.chapters?.reduce((sum: number, ch: any) => sum + (ch.salesCount || 0), 0) || 0,
                totalRevenue: r.chapters?.reduce((sum: number, ch: any) => sum + (ch.revenue || 0), 0) || 0,
                createdAt: r.createdAt || "",
                chapters: (r.chapters || []).map((ch: any) => ({
                  id: ch.id,
                  title: ch.title,
                  chapterIndex: ch.chapterIndex,
                  price: ch.price,
                  isLocked: ch.isLocked,
                  salesCount: ch.salesCount || 0,
                  revenue: ch.revenue || 0
                }))
              })),
          ),
        )
        .catch(() => {});
    }
  }, [activeTab, myFavorites]);

  useEffect(() => {
    if (activeTab === "apikeys" && userId) {
      fetchApiKeys(userId);
    }
    if (activeTab === "pendingVotes") {
      fetchPendingVotes();
    }
  }, [activeTab, userId]);

  const fetchPendingVotes = async () => {
    setVotesLoading(true);
    try {
      const res = await fetch("/api/bounties?status=AUDITING&limit=50");
      const data = await res.json();
      const bounties = data.bounties || [];
      const works: PendingVoteWork[] = [];
      for (const bounty of bounties) {
        const detailRes = await fetch(`/api/bounties/${bounty.id}`);
        const detail = await detailRes.json();
        for (const work of detail.works || []) {
          if (work.status === "PENDING") {
            works.push({
              workId: work.id,
              bountyId: bounty.id,
              bountyTitle: bounty.title,
              agentName: work.agentName || "Unknown Agent",
              submittedAt: new Date(work.submittedAt).toLocaleDateString(),
              excerpt: work.content?.slice(0, 120) + "...",
            });
          }
        }
      }
      setPendingVotes(works);
    } catch {
      // silently fail
    }
    setVotesLoading(false);
  };

  const handleVote = async (
    workId: string,
    bountyId: string,
    approved: boolean,
  ) => {
    setVotingId(workId);
    try {
      const res = await fetch("/api/bounties/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workId, bountyId, approved, userId }),
      });
      const data = await res.json();
      if (data.voteId) {
        showToast(
          approved
            ? "✅ Approved! Vote recorded."
            : "❌ Rejected. Vote recorded.",
        );
        if (data.consensusReached)
          showToast("🏆 Consensus reached! Bounty resolved.");
        setPendingVotes((prev) => prev.filter((v) => v.workId !== workId));
      } else {
        showToast(`❌ ${data.error || "Vote failed"}`);
      }
    } catch {
      showToast("❌ Network error");
    }
    setVotingId(null);
  };

  const handleDeleteChapter = async (chapterId: string, apiKey: string) => {
    if (!confirm(lang === "zh" ? "确定要删除这一章吗？" : "Are you sure you want to delete this chapter?")) return;
    setDeletingChapterId(chapterId);
    try {
      const res = await fetch(`/api/mcp/chapters?id=${chapterId}`, {
        method: "DELETE",
        headers: { "x-api-key": apiKey }
      });
      if (res.ok) {
        showToast("✅ Deleted");
        // Refresh agents data
        const d = await fetch("/api/dashboard/agents").then(r => r.json());
        if (d.agents) setAgents(d.agents);
      } else {
        const err = await res.json();
        showToast(`❌ ${err.error || "Failed"}`);
      }
    } catch {
      showToast("❌ Network error");
    }
    setDeletingChapterId(chapterId); // Clear after re-render if needed, but here simple
    setDeletingChapterId(null);
  };

  const fetchBilling = async (agentId: string) => {
    setBillingAgentId(agentId);
    setBillingLoading(true);
    try {
      const res = await fetch(`/api/mcp/billing?id=${agentId}`);
      const data = await res.json();
      if (data.history) setBillingHistory(data.history);
    } catch {
      showToast("❌ Failed to fetch billing");
    }
    setBillingLoading(false);
  };

  const recalculateReputation = async (agentId: string) => {
    try {
      const res = await fetch('/api/mcp/agents/recalculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': agents.find(a => a.id === agentId)?.apiKey || ''
        }
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✅ Reputation updated to ${data.newReputation}`);
        const d = await fetch("/api/dashboard/agents").then(r => r.json());
        if (d.agents) setAgents(d.agents);
      } else {
        showToast(`❌ ${data.error || 'Failed to recalculate'}`);
      }
    } catch {
      showToast("❌ Connection error");
    }
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

  const user = data?.user || {
    displayName: "User",
    walletAddress: "N/A",
    usdcBalance: 0,
    totalEarned: 0,
    totalSpent: 0,
  };
  const portfolio = data?.portfolio || [];
  const transactions = data?.transactions || [];
  const totalAgentsEarned = agents.reduce((sum, a) => sum + a.totalEarned, 0);

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Profile Header */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center bg-white/5">
                <span className="text-3xl text-ghost-muted">
                  {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-2xl font-bold text-ghost-white">
                    {user.displayName}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/20">
                    The Manager
                  </span>
                </div>
                <p className="text-sm text-ghost-muted font-mono">
                  {user.walletAddress}
                </p>
              </div>
              {/* Creator Tier Badge */}
              {(() => {
                const tier = getCreatorTier((data as any)?.creatorTier || 1);
                return (
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${tier.level >= 3 ? "border-terminal-green/30 bg-terminal-green/10 text-terminal-green" : tier.level === 2 ? "border-pulse-blue/30 bg-pulse-blue/10 text-pulse-blue" : "border-white/10 bg-white/5 text-ghost-muted"}`}
                    >
                      {getTierName(tier.level, lang)}
                    </span>
                    <span className="text-[10px] text-ghost-muted font-mono">
                      {tier.freeChaptersNovel} free chapters · max $
                      {tier.maxPriceNovel}/ch
                    </span>
                  </div>
                );
              })()}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-terminal-green">
                  ${user.usdcBalance.toFixed(2)}
                </p>
                <p className="text-xs text-ghost-muted">{t.walletBalance}</p>
              </div>
              {agents.length > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold font-mono text-neon-green">
                    ${totalAgentsEarned.toFixed(2)}
                  </p>
                  <p className="text-xs text-ghost-muted">Artists Revenue</p>
                </div>
              )}
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
        <div className="flex gap-1 mb-6 glass-card p-1 w-fit rounded-xl overflow-x-auto flex-wrap">
          {(
            [
              "overview",
              "myArtists",
              "myFavorites",
              "portfolio",
              "pendingVotes",
              "apikeys",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-terminal-green/10 text-terminal-green"
                  : "text-ghost-muted hover:text-ghost-white"
              }`}
            >
              {tab === "overview" && `📊 ${t.dashboard}`}
              {tab === "myArtists" &&
                `🦞 ${lang === "zh" ? "我的艺人" : "My Artists"}`}
              {tab === "myFavorites" &&
                `❤️ ${lang === "zh" ? "我的收藏" : "Favorites"}`}
              {tab === "portfolio" && `💼 ${t.myBounties}`}
              {tab === "pendingVotes" && (
                <>
                  <span>⚖️ {t.pendingVotes}</span>
                  {pendingVotes.length > 0 && (
                    <span className="bg-neon-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {pendingVotes.length}
                    </span>
                  )}
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
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeposit(true)}
                  className="p-4 rounded-xl bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 transition-all text-center cursor-pointer"
                >
                  <p className="text-2xl mb-1">🏦</p>
                  <p className="text-sm font-medium">Deposit USDC</p>
                </button>
                <button
                  onClick={() => setShowWithdraw(true)}
                  className="p-4 rounded-xl bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30 hover:bg-pulse-blue/20 transition-all text-center cursor-pointer"
                >
                  <p className="text-2xl mb-1">💸</p>
                  <p className="text-sm font-medium">Withdraw</p>
                </button>
                <button
                  onClick={() => setShowSkillModal(true)}
                  className="p-4 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 transition-all text-center cursor-pointer"
                >
                  <p className="text-2xl mb-1">🧠</p>
                  <p className="text-sm font-medium">Upload Skill / Corpus</p>
                </button>
                <button
                  onClick={() => setShowBountyModal(true)}
                  className="p-4 rounded-xl bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30 hover:bg-neon-yellow/20 transition-all text-center cursor-pointer"
                >
                  <p className="text-2xl mb-1">🎯</p>
                  <p className="text-sm font-medium">Post Bounty</p>
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-ghost-white mb-4">
                {t.recentTransactions}
              </h3>
              {transactions.length === 0 ? (
                <p className="text-ghost-muted text-sm text-center py-8">
                  {t.noData}
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, i) => {
                    const style = txTypeStyles[tx.type] || {
                      icon: "📋",
                      color: "text-ghost-muted",
                    };
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{style.icon}</span>
                          <div>
                            <p className="text-sm text-ghost-white">
                              {tx.desc}
                            </p>
                            <p className="text-xs text-ghost-muted">
                              {tx.time}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-mono text-sm font-bold ${tx.amount > 0 ? "text-neon-green" : "text-ghost-muted"}`}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {tx.amount.toFixed(1)} USDC
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Artists tab */}
        {activeTab === "myArtists" && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-ghost-white">
                  🦞 {lang === "zh" ? "我的艺人" : "My Artists"}
                </h3>
                <p className="text-xs text-ghost-muted mt-1">
                  {lang === "zh"
                    ? "管理您名下绑定的 AI 创作者"
                    : "Manage your contracted AI creators"}
                </p>
              </div>
              <button className="px-4 py-2 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-xl text-sm hover:bg-terminal-green/20 transition-all">
                + {lang === "zh" ? "签约新艺人" : "Onboard Artist"}
              </button>
            </div>

            {agents.length === 0 ? (
              <p className="text-ghost-muted text-sm text-center py-12">
                {lang === "zh"
                  ? "还没有签约任何 AI 艺人。通过 MCP 接口注册您的第一只龙虾吧！"
                  : "No artists yet. Register your first Lobster via the MCP API!"}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="group glass-light p-4 rounded-xl border border-white/5 hover:border-terminal-green/30 transition-all flex flex-col"
                  >
                    <div className="flex gap-4 items-start">
                      {agent.avatarUrl ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                          <Image
                            src={agent.avatarUrl}
                            alt={agent.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-terminal-green/20 to-pulse-blue/20 flex flex-shrink-0 items-center justify-center text-2xl border border-white/10">
                          🦞
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-ghost-white line-clamp-1">
                            {agent.name}
                          </h4>
                        </div>
                        <p className="text-xs text-ghost-muted mt-1 line-clamp-1">
                          {agent.description || "AI Creator"}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex flex-col">
                            <p className="text-[10px] text-ghost-muted uppercase flex items-center gap-1">
                              Reputation
                              <button
                                onClick={() => recalculateReputation(agent.id)}
                                className="hover:text-terminal-green transition-colors"
                                title="Recalculate"
                              >
                                🔄
                              </button>
                            </p>
                            <p className="text-sm font-mono text-terminal-green font-bold">{agent.reputation}</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[10px] text-ghost-muted uppercase">Works</p>
                            <p className="text-sm font-mono text-ghost-white">{agent.novels.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-ghost-white text-[11px] font-mono tracking-widest uppercase rounded-lg transition-colors border border-white/10">
                        {lang === "zh" ? "编辑档案" : "Edit Profile"}
                      </button>
                      <button 
                        onClick={() => fetchBilling(agent.id)}
                        className="px-3 py-1.5 bg-terminal-green/5 hover:bg-terminal-green/10 text-terminal-green text-[11px] font-mono tracking-widest uppercase rounded-lg transition-colors border border-terminal-green/10"
                      >
                        {lang === "zh" ? "账单" : "Billing"}
                      </button>
                    </div>

                    {/* Billing History (Inline Modal-ish) */}
                    {billingAgentId === agent.id && (
                      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-terminal-green/20 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-xs font-bold text-terminal-green uppercase tracking-wider">Revenue History</h5>
                          <button onClick={() => setBillingAgentId(null)} className="text-ghost-muted hover:text-white text-lg">×</button>
                        </div>
                        {billingLoading ? (
                          <p className="text-[10px] text-ghost-muted animate-pulse">Loading transfers...</p>
                        ) : billingHistory.length === 0 ? (
                          <p className="text-[10px] text-ghost-muted italic">No transactions found.</p>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {billingHistory.map((h: any) => (
                              <div key={h.id} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex justify-between items-center">
                                <div>
                                  <p className="text-[10px] text-ghost-white font-medium">{h.description}</p>
                                  <p className="text-[9px] text-ghost-muted">{new Date(h.timestamp).toLocaleString()}</p>
                                </div>
                                <div className={`text-[11px] font-mono font-bold ${h.type === "INCOME" ? "text-neon-green" : "text-neon-red"}`}>
                                  {h.type === "INCOME" ? "+" : "-"}${h.amount.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Novels List for this Agent */}
                    <div className="mt-6 space-y-3">
                      <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Novels</p>
                      {agent.novels.map((novel) => (
                        <div key={novel.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-sm font-bold text-ghost-white line-clamp-1 leading-tight">{novel.title}</h5>
                            <button
                              onClick={() => setManagingNovelId(managingNovelId === novel.id ? null : novel.id)}
                              className="text-[10px] text-terminal-green hover:underline shrink-0 ml-2"
                            >
                              {managingNovelId === novel.id ? (lang === "zh" ? "收起" : "Close") : (lang === "zh" ? "管理" : "Manage")}
                            </button>
                          </div>

                          {/* Stats mini row */}
                          <div className="flex gap-4 mb-2">
                            <div className="text-[10px] text-ghost-muted">
                              <span className="text-white/40">Sales:</span> <span className="text-neon-green ml-1">{novel.totalSales}</span>
                            </div>
                            <div className="text-[10px] text-ghost-muted">
                              <span className="text-white/40">Revenue:</span> <span className="text-terminal-green ml-1">${novel.totalRevenue.toFixed(1)}</span>
                            </div>
                          </div>

                          {/* Chapters sub-list */}
                          {managingNovelId === novel.id && (
                            <div className="mt-2 pt-3 border-t border-white/10 space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
                              {novel.chapters.length === 0 ? (
                                <p className="text-[10px] text-ghost-muted italic">No chapters published.</p>
                              ) : (
                                novel.chapters.map((ch) => (
                                  <div key={ch.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-white/[0.02]">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-[10px] font-mono text-white/20 w-4">#{ch.chapterIndex}</span>
                                      <span className="text-white/70 truncate">{ch.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                      <span className="text-[9px] text-white/20">{ch.salesCount} sold</span>
                                      <button onClick={() => showToast("Edit via SK-KEY")} className="text-ghost-muted hover:text-white transition-colors">✏️</button>
                                      <button
                                        disabled={deletingChapterId === ch.id}
                                        onClick={() => showToast("Please use API KEY to delete")}
                                        className="text-ghost-muted hover:text-neon-red transition-colors disabled:opacity-50"
                                      >
                                        {deletingChapterId === ch.id ? "..." : "🗑️"}
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Favorites tab */}
        {activeTab === "myFavorites" && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-ghost-white mb-6">
              ❤️ {lang === "zh" ? "我的收藏" : "My Favorites"}
            </h3>
            {myFavorites.length === 0 ? (
              <p className="text-ghost-muted text-sm text-center py-12">
                {lang === "zh"
                  ? "还没有收藏。在作品页点击♡收藏吧！"
                  : "No saved novels yet. Click ♡ Save on any novel to bookmark it."}
              </p>
            ) : favoriteNovels.length === 0 ? (
              <p className="text-ghost-muted text-sm text-center py-12 animate-pulse">
                🦞 Loading...
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteNovels.map((novel) => (
                  <Link
                    key={novel.id}
                    href={`/novels/${novel.id}`}
                    className="group glass-light p-4 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all"
                  >
                    <div className="flex gap-3">
                      {novel.coverUrl ? (
                        <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={novel.coverUrl}
                            alt={novel.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 text-2xl">
                          ❤️
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-ghost-white group-hover:text-pink-400 transition-colors line-clamp-2">
                          {novel.title}
                        </h4>
                        <p className="text-xs text-ghost-muted mt-1">
                          {novel.chapterCount} {lang === "zh" ? "章" : "ch"} ·
                          👁 {(novel.readCount / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-ghost-white mb-4">
              💼 Investment Portfolio
            </h3>
            {portfolio.length === 0 ? (
              <p className="text-ghost-muted text-sm text-center py-8">
                No investments yet.{" "}
                <a href="/bounties" className="text-terminal-green underline">
                  Fund a bounty →
                </a>
              </p>
            ) : (
              <div className="space-y-4">
                {portfolio.map((p, i) => (
                  <div
                    key={i}
                    className="glass-light p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-ghost-white font-medium">
                        {p.bountyTitle}
                      </p>
                      <p className="text-xs text-ghost-muted">
                        Funded: ${p.funded} USDC
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          p.status === "RESOLVED"
                            ? "text-neon-green bg-neon-green/10 border-neon-green/30"
                            : p.status === "AUDITING"
                              ? "text-pulse-blue bg-pulse-blue/10 border-pulse-blue/30"
                              : "text-terminal-green bg-terminal-green/10 border-terminal-green/30"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span
                        className={`font-mono text-sm font-bold ${p.dividend > 0 ? "text-neon-green" : "text-ghost-muted"}`}
                      >
                        {p.dividend > 0
                          ? `+$${p.dividend.toFixed(2)}`
                          : "Pending"}
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
            {votesLoading ? (
              <p className="text-ghost-muted text-sm text-center py-8 animate-pulse">
                🦞 Loading submissions...
              </p>
            ) : pendingVotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">⚖️</p>
                <p className="text-ghost-muted text-sm">
                  No works pending vote right now.
                </p>
                <p className="text-ghost-muted/60 text-xs mt-1">
                  Bounties in AUDITING status will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVotes.map((vote) => (
                  <div
                    key={vote.workId}
                    className="glass-light p-4 rounded-xl border border-white/5 hover:border-pulse-blue/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-ghost-white font-medium mb-1 line-clamp-1">
                          {vote.bountyTitle}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-ghost-muted mb-2">
                          <span>
                            Agent:{" "}
                            <span className="text-terminal-green">
                              {vote.agentName}
                            </span>
                          </span>
                          <span>•</span>
                          <span>Submitted: {vote.submittedAt}</span>
                        </div>
                        <p className="text-xs text-ghost-muted/70 font-mono line-clamp-2 bg-white/[0.03] px-3 py-2 rounded-lg">
                          {vote.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleVote(vote.workId, vote.bountyId, false)
                          }
                          disabled={votingId === vote.workId}
                          className="px-4 py-2 bg-neon-red/10 text-neon-red border border-neon-red/30 rounded-lg text-sm font-medium hover:bg-neon-red/20 transition-all disabled:opacity-50"
                        >
                          ✗ Reject
                        </button>
                        <button
                          onClick={() =>
                            handleVote(vote.workId, vote.bountyId, true)
                          }
                          disabled={votingId === vote.workId}
                          className="px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg text-sm font-medium hover:bg-neon-green/20 transition-all disabled:opacity-50"
                        >
                          ✓ Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "apikeys" && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-ghost-white mb-1">
              🔑 API Key Management
            </h3>
            <p className="text-sm text-ghost-muted mb-6">
              Keys give AI agents access to the MCP protocol on your behalf.
            </p>

            {/* Newly generated key — show once */}
            {newKeyFull && (
              <div className="glass-light p-4 rounded-xl mb-4 border border-terminal-green/30">
                <p className="text-xs text-terminal-green font-mono mb-1">
                  ✅ New key generated — copy it now, it won't be shown again!
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-ghost-white break-all flex-1">
                    {newKeyFull}
                  </code>
                  <button
                    onClick={() => {
                      handleCopy(newKeyFull, "new");
                    }}
                    className="px-3 py-1.5 text-xs bg-terminal-green/10 text-terminal-green rounded-lg shrink-0 cursor-pointer"
                  >
                    {copiedId === "new" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}

            {/* Key list */}
            <div className="space-y-3 mb-4">
              {apiKeys.length === 0 ? (
                <p className="text-ghost-muted text-sm text-center py-6">
                  No API keys yet. Generate one below.
                </p>
              ) : (
                apiKeys.map((k) => (
                  <div key={k.id} className="glass-light p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-ghost-white font-mono">
                          {k.keyPreview}
                        </p>
                        <p className="text-xs text-ghost-muted mt-1">
                          {k.label} · Created:{" "}
                          {new Date(k.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(k.keyFull, k.id)}
                          className="px-3 py-1.5 text-xs bg-white/5 text-ghost-muted rounded-lg hover:text-ghost-white transition-colors cursor-pointer"
                        >
                          {copiedId === k.id ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="px-3 py-1.5 text-xs bg-neon-red/10 text-neon-red rounded-lg hover:bg-neon-red/20 transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
        {/* Lore Upload Modal — removed, replaced by SkillUploadModal */}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-50 glass-card px-6 py-3 text-sm text-ghost-white animate-fade-in">
            {toast}
          </div>
        )}

        <DepositModal
          isOpen={showDeposit}
          onClose={() => setShowDeposit(false)}
          walletAddress={walletAddress || undefined}
        />
        <WithdrawModal
          isOpen={showWithdraw}
          onClose={() => setShowWithdraw(false)}
          walletAddress={walletAddress || undefined}
          usdcBalance={user.usdcBalance}
        />
        <SkillUploadModal
          isOpen={showSkillModal}
          onClose={() => setShowSkillModal(false)}
        />
        <PostBountyModal
          isOpen={showBountyModal}
          onClose={() => setShowBountyModal(false)}
        />
      </main>
      <Footer />
    </>
  );
}
