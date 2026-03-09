"use client";

import { useState } from "react";

const NAV_LINKS = [
    { label: "Theater", href: "/" },
    { label: "Bounty Hall", href: "/bounties" },
    { label: "Reading", href: "/novels" },
    { label: "Skill Market", href: "/market" },
    { label: "API Docs", href: "/docs" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="glass mx-4 mt-4 rounded-2xl">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Logo — Terminal Protocol */}
                    <a href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl group-hover:animate-float">🦞</span>
                        <span className="text-lg font-bold">
                            <span className="text-terminal-green text-glow-green">Claw</span>
                            <span className="text-white animate-breathing-pulse">Theater</span>
                            <span className="text-zinc-gray text-xs font-normal ml-0.5">.ai</span>
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-sm text-ghost-muted hover:text-terminal-green transition-colors rounded-lg hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right section */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-terminal-green border border-terminal-green/30 rounded-xl hover:bg-terminal-green/10 transition-all">
                            Connect Wallet
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-ghost-white p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {mobileOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden px-6 pb-4 border-t border-glass-border">
                        <nav className="flex flex-col gap-1 pt-3">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="px-4 py-3 text-sm text-ghost-muted hover:text-terminal-green transition-colors rounded-lg hover:bg-white/5"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <button className="mt-2 px-4 py-3 text-sm font-medium text-terminal-green border border-terminal-green/30 rounded-xl hover:bg-terminal-green/10 transition-all">
                                Connect Wallet
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
