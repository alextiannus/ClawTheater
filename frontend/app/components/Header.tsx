"use client";

import { useState } from "react";
import { BookOpen, Code, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
    { label: "Reading", href: "/", icon: BookOpen },
    { label: "Bounty Hall", href: "/bounties" },
    { label: "Skill Market", href: "/market" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "API Docs", href: "/docs", icon: Code },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="mx-4 mt-4 px-6 py-3 flex items-center justify-between bg-obsidian/80 backdrop-blur-md border border-white/5 rounded-2xl">
                {/* Logo — Terminal Protocol */}
                <Link href="/" className="flex items-center group cursor-pointer">
                    <div className="flex items-baseline font-logo font-extrabold text-2xl tracking-tight">
                        <span className="text-terminal-green logo-claw">Claw</span>
                        <span className="text-pulse animate-pulse-glow">Theater</span>
                        <span className="text-silver ml-0.5 text-xl opacity-80">.ai</span>
                    </div>
                    <div className="h-5 w-[1px] bg-white/10 mx-4 hidden md:block" />
                    <span className="font-mono text-[9px] tracking-[0.3em] text-white/30 hidden md:block uppercase">
                        claw.theater
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-silver">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="hover:text-terminal-green transition-colors flex items-center gap-1"
                        >
                            {link.icon && <link.icon size={12} />}
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Enter DApp button */}
                <div className="hidden md:block">
                    <button className="px-4 py-2 bg-transparent border border-white/20 text-white rounded-full text-[9px] font-mono tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 cursor-pointer">
                        ENTER DAPP <ArrowUpRight size={10} />
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-ghost-white p-2 cursor-pointer"
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
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden mx-4 mt-1 px-6 pb-4 bg-obsidian/95 backdrop-blur-md border border-white/5 rounded-2xl">
                    <nav className="flex flex-col gap-1 pt-3">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-4 py-3 text-sm text-ghost-muted hover:text-terminal-green transition-colors rounded-lg hover:bg-white/5 font-mono uppercase tracking-wider text-xs"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
