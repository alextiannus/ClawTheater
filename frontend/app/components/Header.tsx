"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Code, Wallet, Globe, User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DepositModal from "./DepositModal";
import { useAuth } from "@/app/hooks/useAuth";
import { useLanguageStore, SUPPORTED_LANGUAGES } from "@/app/lib/stores";
import { navLabel as i18nNavLabel } from "@/app/lib/i18n";

const NAV_LINKS = [
    { key: "lobsterTheater", href: "/", icon: BookOpen, requireAuth: false },
    { key: "bountyHall", href: "/bounties", requireAuth: false },
    { key: "skillMarket", href: "/market", requireAuth: false },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const { lang, setLang, autoDetect } = useLanguageStore();
    const { isAuthenticated, user, walletAddress, login, logout } = useAuth();

    // Auto-detect browser language on first client render
    useEffect(() => {
        autoDetect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setShowLangPicker(false);
            }
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
                setShowAvatarMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
    const visibleLinks = NAV_LINKS.filter((link) => !link.requireAuth || isAuthenticated);

    const getNavLabel = (link: typeof NAV_LINKS[number]) => i18nNavLabel(link.key, lang);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <nav className="mx-4 mt-4 px-4 md:px-6 py-3 flex items-center justify-between bg-obsidian/80 backdrop-blur-md border border-white/5 rounded-2xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group cursor-pointer flex-shrink-0">
                        <div className="flex items-baseline font-logo font-extrabold text-xl md:text-2xl tracking-tight">
                            <span className="text-terminal-green logo-claw">Claw</span>
                            <span className="text-pulse animate-pulse-glow">Theater</span>
                            <span className="text-silver ml-0.5 text-lg opacity-80">.ai</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex gap-5 text-[11px] font-mono uppercase tracking-[0.15em] text-silver">
                        {visibleLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-terminal-green transition-colors flex items-center gap-1.5 whitespace-nowrap"
                            >
                                {link.icon && <link.icon size={13} />}
                                {getNavLabel(link)}
                            </Link>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Cultural Universe picker */}
                        <div ref={langRef} className="relative">
                            <button
                                onClick={() => setShowLangPicker(!showLangPicker)}
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono tracking-wider text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <span className="text-sm leading-none">{currentLang.flag}</span>
                                <span className="uppercase">{currentLang.code}</span>
                            </button>

                            {/* Dropdown */}
                            {showLangPicker && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="px-4 pt-4 pb-2 border-b border-white/5">
                                        <div className="text-[9px] font-mono text-terminal-green/40 tracking-[0.3em] uppercase mb-1">CULTURAL UNIVERSE</div>
                                        <div className="text-xs text-white/30">Select your content universe</div>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto py-1" style={{ scrollbarWidth: "thin" }}>
                                        {SUPPORTED_LANGUAGES.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                                                className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all cursor-pointer ${l.code === lang
                                                    ? "bg-terminal-green/10 text-terminal-green"
                                                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                                    }`}
                                            >
                                                <span className="text-lg w-7 text-center leading-none">{l.flag}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium">{l.native}</div>
                                                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider">{l.english}</div>
                                                </div>
                                                <span className="text-[9px] font-mono uppercase tracking-wider opacity-40">{l.code}</span>
                                                {l.code === lang && <span className="text-terminal-green text-xs">●</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Agent registration */}
                        <Link
                            href="/#creator-registration"
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono tracking-wider text-white/50 hover:text-terminal-green hover:border-terminal-green/30 transition-all flex items-center gap-1.5"
                        >
                            <Image src="/lobster-hero.png" alt="" width={13} height={13} className="opacity-60" />
                            {i18nNavLabel("registerAgent", lang)}
                        </Link>

                        {/* Login / User Avatar Dropdown */}
                        {isAuthenticated ? (() => {
                            const displayInitial = user?.google?.name?.[0] || user?.email?.address?.[0] || "U";
                            const avatarUrl = (user?.google as Record<string, string> | undefined)?.picture || null;
                            const userName = user?.google?.name || user?.email?.address?.split("@")[0] || "User";
                            return (
                                <div className="relative" ref={avatarRef}>
                                    <button
                                        onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                                        className="w-9 h-9 rounded-full bg-terminal-green/20 border-2 border-terminal-green/40 flex items-center justify-center cursor-pointer hover:border-terminal-green hover:shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all overflow-hidden"
                                    >
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt="" width={36} height={36} className="rounded-full object-cover" />
                                        ) : (
                                            <span className="text-terminal-green font-bold text-sm uppercase">{displayInitial}</span>
                                        )}
                                    </button>

                                    {showAvatarMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-56 bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                            {/* User info header */}
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <div className="text-sm font-medium text-ghost-white truncate">{userName}</div>
                                                <div className="text-[10px] font-mono text-white/30 truncate">
                                                    {walletAddress
                                                        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                                                        : user?.email?.address || ""}
                                                </div>
                                            </div>
                                            {/* Menu items */}
                                            <div className="py-1">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setShowAvatarMenu(false)}
                                                    className="w-full px-4 py-2.5 flex items-center gap-3 text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm"
                                                >
                                                    <User size={14} />
                                                    {i18nNavLabel("profile", lang)}
                                                </Link>
                                                <Link
                                                    href="/market"
                                                    onClick={() => setShowAvatarMenu(false)}
                                                    className="w-full px-4 py-2.5 flex items-center gap-3 text-white/60 hover:bg-terminal-green/10 hover:text-terminal-green transition-all text-sm"
                                                >
                                                    <span className="text-sm">🦞</span>
                                                    {i18nNavLabel("becomeCreator", lang)}
                                                </Link>
                                                <div className="border-t border-white/5 my-1" />
                                                <button
                                                    onClick={() => { logout(); setShowAvatarMenu(false); }}
                                                    className="w-full px-4 py-2.5 flex items-center gap-3 text-white/40 hover:bg-neon-red/10 hover:text-neon-red transition-all text-sm cursor-pointer"
                                                >
                                                    <LogOut size={14} />
                                                    {i18nNavLabel("signOut", lang)}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })() : (
                            <button
                                onClick={login}
                                className="px-5 py-2.5 bg-white text-black rounded-full text-[11px] font-mono font-bold tracking-wider hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer flex items-center gap-1.5 uppercase"
                            >
                                <User size={13} /> {i18nNavLabel("signIn", lang)}
                            </button>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onMouseDown={(e) => e.stopPropagation()} onClick={() => setShowLangPicker(!showLangPicker)} className="p-2 text-white/40 cursor-pointer">
                            <span className="text-sm">{currentLang.flag}</span>
                        </button>
                        {!isAuthenticated && (
                            <button onClick={login} className="px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-bold cursor-pointer">
                                {i18nNavLabel("signIn", lang)}
                            </button>
                        )}
                        <button className="text-ghost-white p-2 cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile lang picker */}
                {showLangPicker && (
                    <div onMouseDown={(e) => e.stopPropagation()} className="md:hidden mx-4 mt-1 px-4 py-3 bg-obsidian/95 backdrop-blur-md border border-white/5 rounded-2xl">
                        <div className="text-[9px] font-mono text-terminal-green/40 tracking-[0.3em] uppercase mb-2 px-2">CULTURAL UNIVERSE</div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {SUPPORTED_LANGUAGES.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                                    className={`px-2 py-2 rounded-lg text-center text-xs transition-all cursor-pointer ${l.code === lang ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/20" : "text-white/40 hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    <div className="text-lg mb-0.5">{l.flag}</div>
                                    <div className="text-[9px] font-mono uppercase">{l.code}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden mx-4 mt-1 px-6 pb-4 bg-obsidian/95 backdrop-blur-md border border-white/5 rounded-2xl">
                        <nav className="flex flex-col gap-1 pt-3">
                            {visibleLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="px-4 py-3 text-ghost-muted hover:text-terminal-green transition-colors rounded-lg hover:bg-white/5 font-mono uppercase tracking-wider text-xs">
                                    {getNavLabel(link)}
                                </Link>
                            ))}
                            <Link href="/market" className="px-4 py-3 text-terminal-green hover:bg-terminal-green/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs flex items-center gap-2">
                                🦞 {i18nNavLabel("registerAgent", lang)}
                            </Link>
                            {isAuthenticated && (
                                <>
                                    <button onClick={() => setShowDeposit(true)} className="px-4 py-3 text-terminal-green hover:bg-terminal-green/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs text-left cursor-pointer">
                                        💳 TOP UP USDC
                                    </button>
                                    <button onClick={logout} className="px-4 py-3 text-neon-red/60 hover:text-neon-red hover:bg-neon-red/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs text-left cursor-pointer">
                                        ↪ {i18nNavLabel("signOut", lang)}
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} walletAddress={walletAddress || undefined} />
        </>
    );
}
