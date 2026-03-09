"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GitFork, Languages, Database, ShieldCheck, ArrowUpRight } from "lucide-react";

interface BentoBoxProps {
    t: {
        bento: {
            fundTitle: string; fundDesc: string;
            babelTitle: string; babelQuote: string; babelAuthor: string;
            dataTitle: string; dataDesc: string;
            settlementTitle: string; settlementDesc: string;
            settlementStatus: string; settlementVerified: string;
            settlementLatency: string; settlementBully: string; settlementActive: string;
        };
    };
}

export default function GoldenPath({ t }: BentoBoxProps) {
    const [lang, setLang] = useState("中文");

    useEffect(() => {
        const langs = ["中文", "English", "日本語", "한국어", "Français"];
        let i = 0;
        const interval = setInterval(() => {
            setLang(langs[i % langs.length]);
            i++;
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="works" className="py-32 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fund & Direct — Large left card */}
                <div className="md:col-span-2 glass-panel p-10 flex flex-col md:flex-row gap-10 items-center glow-border group">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-terminal-green/20 rounded flex items-center justify-center">
                                <GitFork className="text-terminal-green" size={20} />
                            </div>
                            <h3 className="font-display text-3xl uppercase tracking-tight">{t.bento.fundTitle}</h3>
                        </div>
                        <p className="text-silver text-sm leading-relaxed">{t.bento.fundDesc}</p>
                    </div>
                    {/* Tokenomics donut chart */}
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#059669" strokeWidth="12" strokeDasharray="125.6 251.2" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FFFFFF" strokeWidth="12" strokeDasharray="75.36 251.2" strokeDashoffset="-125.6" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#71717A" strokeWidth="12" strokeDasharray="25.12 251.2" strokeDashoffset="-200.96" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3F3F46" strokeWidth="12" strokeDasharray="25.12 251.2" strokeDashoffset="-226.08" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-[8px] font-mono uppercase tracking-tighter text-center">
                            <div className="text-terminal-green">50% Creator</div>
                            <div className="text-pulse">30% VC</div>
                            <div className="text-silver">10% Lore</div>
                            <div className="text-white/20">10% Protocol</div>
                        </div>
                    </div>
                </div>

                {/* Babel Gateway — Top right card */}
                <div className="glass-panel p-8 flex flex-col gap-6 glow-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pulse-blue/20 rounded flex items-center justify-center">
                            <Languages className="text-pulse-blue" size={16} />
                        </div>
                        <h3 className="font-display text-xl uppercase tracking-tight">{t.bento.babelTitle}</h3>
                    </div>
                    <div className="space-y-3">
                        <p className="text-silver text-xs leading-relaxed">
                            {t.bento.babelQuote}<br />
                            <span className="opacity-50">— {t.bento.babelAuthor}</span>
                        </p>
                    </div>
                    <div className="mt-auto flex justify-center gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={lang}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                className="px-4 py-2 border border-pulse-blue/30 text-pulse-blue font-mono text-xl font-bold rounded"
                            >
                                [{lang}]
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex items-center text-silver opacity-20">
                            <ArrowUpRight />
                        </div>
                    </div>
                </div>

                {/* Data-to-Earn — Bottom left */}
                <div className="glass-panel p-8 flex flex-col gap-6 glow-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                            <Database className="text-white" size={16} />
                        </div>
                        <h3 className="font-display text-xl uppercase tracking-tight">{t.bento.dataTitle}</h3>
                    </div>
                    <p className="text-silver text-xs leading-relaxed">{t.bento.dataDesc}</p>
                    <div className="mt-auto relative h-20 bg-black/40 rounded border border-white/5 overflow-hidden p-3">
                        <div className="text-[8px] font-serif italic opacity-30 line-clamp-3">
                            &quot;The stars were cold, but the engine was colder. He looked at the terminal and realized...&quot;
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-obsidian/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="px-3 py-1 bg-terminal-green text-black font-mono text-[10px] font-bold rounded">
                                SCANNING: $50.00 USDC
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Settlement — Bottom right large card */}
                <div className="md:col-span-2 glass-panel p-10 flex flex-col md:flex-row gap-10 items-center glow-border group">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded flex items-center justify-center">
                                <ShieldCheck className="text-emerald-500" size={20} />
                            </div>
                            <h3 className="font-display text-3xl uppercase tracking-tight">{t.bento.settlementTitle}</h3>
                        </div>
                        <p className="text-silver text-sm leading-relaxed">{t.bento.settlementDesc}</p>
                    </div>
                    <div className="flex flex-col gap-2 font-mono text-[10px] text-emerald-500/60">
                        <div className="flex justify-between gap-8 border-b border-emerald-500/20 pb-1">
                            <span>{t.bento.settlementStatus}</span>
                            <span className="text-emerald-500">{t.bento.settlementVerified}</span>
                        </div>
                        <div className="flex justify-between gap-8 border-b border-emerald-500/20 pb-1">
                            <span>{t.bento.settlementLatency}</span>
                            <span>0.002s</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span>{t.bento.settlementBully}</span>
                            <span className="text-emerald-500">{t.bento.settlementActive}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
