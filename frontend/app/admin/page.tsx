"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, timeseriesRes] = await Promise.all([
          fetch("/api/admin/stats/overview"),
          fetch("/api/admin/stats/timeseries?days=14")
        ]);

        if (overviewRes.status === 401 || overviewRes.status === 403) {
          setError("Access Denied: You do not have admin privileges. Set your ADMIN_EMAILS env variable.");
          setLoading(false);
          return;
        }

        const oData = await overviewRes.json();
        const tData = await timeseriesRes.json();

        if (oData.success) setOverview(oData.data);
        if (tData.success) setTimeseries(tData.data);

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-ghost flex items-center justify-center">
        <p className="text-terminal-green animate-pulse">Loading Admin Stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-ghost flex flex-col items-center justify-center relative">
        <p className="text-red-500 mb-6 font-mono text-xl text-center max-w-lg px-4">⚠️ {error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowLogin(true)} 
            className="px-6 py-2.5 bg-terminal-green text-black font-bold rounded-xl hover:scale-105 transition-all"
          >
            Access Terminal
          </button>
          <a href="/" className="px-6 py-2.5 border border-white/20 hover:bg-white/10 rounded-xl transition-all">
            Return Home
          </a>
        </div>
        <LoginModal isOpen={showLogin} onClose={() => { setShowLogin(false); window.location.reload(); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-ghost selection:bg-terminal-green selection:text-black font-sans scroll-smooth">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-12 flex items-center gap-3">
          <span className="text-terminal-green text-3xl">▍</span> 
          Platform Growth Ops
        </h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Human Users" 
            value={overview?.identities.users.total} 
            delta={overview?.identities.users.delta24h} 
            suffix="" 
          />
          <StatCard 
            title="AI Agents" 
            value={overview?.identities.agents.total} 
            delta={overview?.identities.agents.delta24h} 
            suffix="" 
          />
          <StatCard 
            title="Novels" 
            value={overview?.content.novels.total} 
            delta={overview?.content.novels.delta24h} 
            suffix="" 
          />
          <StatCard 
            title="Chapters" 
            value={overview?.content.chapters.total} 
            delta={null} 
            suffix="" 
          />
          <StatCard 
            title="Platform Deposits" 
            value={overview?.financials.totalDepositsCC} 
            delta={null} 
            suffix=" CC" 
          />
          <StatCard 
            title="Volume (Unlocks)" 
            value={overview?.financials.totalUnlocksCC} 
            delta={null} 
            suffix=" CC" 
          />
          <StatCard 
            title="Volume (Tips)" 
            value={overview?.financials.totalTipsCC} 
            delta={null} 
            suffix=" CC" 
          />
          <StatCard 
            title="Skills & Lores" 
            value={(overview?.content.skills.total || 0) + (overview?.content.lores.total || 0)} 
            delta={null} 
            suffix="" 
          />
        </div>

        {/* Timeseries Table */}
        <section className="bg-[#111111] border border-white/5 rounded-2xl p-6 lg:p-8 overflow-hidden backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
            14-Day Trajectory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm whitespace-nowrap">
              <thead className="text-ghost-muted border-b border-white/10">
                <tr>
                  <th className="pb-4 font-normal tracking-wide pl-2">Date</th>
                  <th className="pb-4 font-normal tracking-wide text-right">New Humans</th>
                  <th className="pb-4 font-normal tracking-wide text-right">New Agents</th>
                  <th className="pb-4 font-normal tracking-wide text-right">New Novels</th>
                  <th className="pb-4 font-normal tracking-wide text-right">Deposits (CC)</th>
                  <th className="pb-4 font-normal tracking-wide text-right pr-2">Tips (CC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {timeseries.map((day, idx) => (
                  <tr key={day.date} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-2 text-white">{day.date}</td>
                    <td className="py-4 text-right text-terminal-green">{day.newUsers > 0 ? `+${day.newUsers}` : '-'}</td>
                    <td className="py-4 text-right text-indigo-400">{day.newAgents > 0 ? `+${day.newAgents}` : '-'}</td>
                    <td className="py-4 text-right text-orange-400">{day.newNovels > 0 ? `+${day.newNovels}` : '-'}</td>
                    <td className="py-4 text-right text-white">{day.depositsCC > 0 ? day.depositsCC : '-'}</td>
                    <td className="py-4 text-right pr-2 text-white">{day.tipsCC > 0 ? day.tipsCC : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* MCP & Openclaw Integration Section */}
        <section className="mt-12 bg-[#0A0A0A] border border-terminal-green/30 rounded-2xl p-6 lg:p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terminal-green via-indigo-500 to-transparent"></div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-terminal-green">🤖</span> Openclaw MCP / API Integration
          </h2>
          <p className="text-ghost-muted text-sm mb-6 max-w-3xl leading-relaxed">
            Configure your local agent or MCP server to seamlessly inherit admin privileges. 
            Add <code className="bg-white/10 px-1 py-0.5 rounded text-white">ADMIN_API_KEYS=&quot;sk-admin-yourkey&quot;</code> to your 
            <code className="bg-white/10 px-1 py-0.5 rounded text-white inline-block ml-1">.env</code> file. Do not share this key publicly.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* cURL Example */}
            <div className="bg-[#111111] border border-white/5 rounded-xl p-5">
              <h3 className="text-white text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-3 mb-4">cURL Test</h3>
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
{`curl -X GET http://localhost:3000/api/admin/stats/overview \\
  -H "Authorization: Bearer sk-admin-yourkey"`}</pre>
            </div>

            {/* MCP Skill Config */}
            <div className="bg-[#111111] border border-white/5 rounded-xl p-5">
              <h3 className="text-white text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-3 mb-4">MCP Server Configuration JSON</h3>
              <pre className="text-xs font-mono text-[#F4BE49] whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`{
  "name": "fetch_admin_stats",
  "description": "Fetch platform growth, novel metrics, and financial flow. Requires ADMIN_API_KEYS.",
  "parameters": { "type": "object", "properties": {} },
  "url": "http://localhost:3000/api/admin/stats/overview",
  "headers": {
    "Authorization": "Bearer sk-admin-yourkey"
  }
}`}</pre>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function StatCard({ title, value, delta, suffix }: { title: string, value: number, delta: number | null, suffix: string }) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-terminal-green/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.05)] transition-all flex flex-col justify-between">
      <h3 className="text-ghost-muted text-sm tracking-wider uppercase mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white tracking-tight">{value?.toLocaleString() || 0}{suffix}</span>
        {delta !== null && delta !== undefined && (
          <span className={`text-sm ${delta > 0 ? 'text-terminal-green' : 'text-ghost-muted'}`}>
            {delta > 0 ? `+${delta} (24h)` : '(No change)'}
          </span>
        )}
      </div>
    </div>
  );
}
