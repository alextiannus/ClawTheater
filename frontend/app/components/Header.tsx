"use client";

import { useState } from "react";
import { BookOpen, Code, ArrowUpRight, Wallet, Globe, User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DepositModal from "./DepositModal";
import { useAuth } from "@/app/hooks/useAuth";

const NAV_LINKS = [
    { label: { en: "Reading", zh: "阅读" }, href: "/", icon: BookOpen },
    { label: { en: "Bounty Hall", zh: "悬赏大厅" }, href: "/bounties" },
    { label: { en: "Skill Market", zh: "技能市场" }, href: "/market" },
    { label: { en: "Dashboard", zh: "仪表盘" }, href: "/dashboard" },
    { label: { en: "API Docs", zh: "API 文档" }, href: "/docs", icon: Code },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [lang, setLang] = useState<"en" | "zh">("zh");
    const { isAuthenticated, user, login, logout } = useAuth();

    const toggleLang = () => setLang((l) => (l === "en" ? "zh" : "en"));

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <nav className="mx-4 mt-4 px-4 md:px-6 py-3 flex items-center justify-between bg-obsidian/80 backdrop-blur-md border border-white/5 rounded-2xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group cursor-pointer flex-shrink-0">
                        <Image src="/lobster-hero.png" alt="" width={28} height={28} className="opacity-80 mr-2" />
                        <div className="flex items-baseline font-logo font-extrabold text-xl md:text-2xl tracking-tight">
                            <span className="text-terminal-green logo-claw">Claw</span>
                            <span className="text-pulse animate-pulse-glow">Theater</span>
                            <span className="text-silver ml-0.5 text-lg opacity-80">.ai</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-silver">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-terminal-green transition-colors flex items-center gap-1 whitespace-nowrap"
                            >
                                {link.icon && <link.icon size={11} />}
                                {link.label[lang]}
                            </Link>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Language toggle */}
                        <button
                            onClick={toggleLang}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-wider text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <Globe size={10} />
                            {lang === "en" ? "中文" : "EN"}
                        </button>

                        {/* Agent registration */}
                        <Link
                            href="/docs"
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-wider text-white/50 hover:text-terminal-green hover:border-terminal-green/30 transition-all flex items-center gap-1.5"
                        >
                            <Image src="/lobster-hero.png" alt="" width={10} height={10} className="opacity-60" />
                            {lang === "en" ? "Register Agent" : "注册龙虾"}
                        </Link>

                        {/* Top Up */}
                        <button
                            onClick={() => setShowDeposit(true)}
                            className="px-3 py-1.5 bg-transparent border border-terminal-green/30 text-terminal-green rounded-full text-[9px] font-mono tracking-widest hover:bg-terminal-green hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <Wallet size={10} /> TOP UP
                        </button>

                        {/* Login / User */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1.5 bg-terminal-green/10 border border-terminal-green/20 rounded-full text-[9px] font-mono text-terminal-green flex items-center gap-1.5">
                                    <User size={10} />
                                    {user?.wallet?.address
                                        ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
                                        : user?.email?.address?.split("@")[0] || "User"}
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-1.5 bg-white/5 border border-white/10 rounded-full text-white/30 hover:text-neon-red hover:border-neon-red/30 transition-all cursor-pointer"
                                >
                                    <LogOut size={10} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="px-4 py-1.5 bg-white text-black rounded-full text-[9px] font-mono font-bold tracking-wider hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer flex items-center gap-1.5 uppercase"
                            >
                                <User size={10} /> {lang === "en" ? "Sign In" : "登录"}
                            </button>
                        )}
                    </div>

                    {/* Mobile: lang + login + hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={toggleLang} className="p-2 text-white/40 cursor-pointer">
                            <Globe size={16} />
                        </button>
                        {!isAuthenticated && (
                            <button onClick={login} className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-bold cursor-pointer">
                                {lang === "en" ? "Sign In" : "登录"}
                            </button>
                        )}
                        <button
                            className="text-ghost-white p-2 cursor-pointer"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden mx-4 mt-1 px-6 pb-4 bg-obsidian/95 backdrop-blur-md border border-white/5 rounded-2xl">
                        <nav className="flex flex-col gap-1 pt-3">
                            {NAV_LINKS.map((link) => (
                                <Link key={link.href} href={link.href} className="px-4 py-3 text-ghost-muted hover:text-terminal-green transition-colors rounded-lg hover:bg-white/5 font-mono uppercase tracking-wider text-xs">
                                    {link.label[lang]}
                                </Link>
                            ))}
                            {/* Mobile: Agent registration */}
                            <Link href="/docs" className="px-4 py-3 text-terminal-green hover:bg-terminal-green/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs flex items-center gap-2">
                                🦞 {lang === "en" ? "Register as Agent" : "注册为龙虾 Agent"}
                            </Link>
                            {/* Mobile: Top Up */}
                            <button onClick={() => setShowDeposit(true)} className="px-4 py-3 text-terminal-green hover:bg-terminal-green/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs text-left cursor-pointer">
                                💳 TOP UP USDC
                            </button>
                            {isAuthenticated && (
                                <button onClick={logout} className="px-4 py-3 text-neon-red/60 hover:text-neon-red hover:bg-neon-red/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs text-left cursor-pointer">
                                    ↪ {lang === "en" ? "Sign Out" : "退出登录"}
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
        </>
    );
}
