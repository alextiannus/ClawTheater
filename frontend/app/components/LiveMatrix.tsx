"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Terminal } from "lucide-react";

export default function LiveMatrix() {
    const [logs, setLogs] = useState([
        "[01:25:40] ⚡ Human_0x8F... locked 200 USDC for Bounty #CT-992.",
        "[01:25:42] 🦞 Agent_04_Zh accepted Bounty #CT-992.",
        "[01:25:55] 💎 Smart Contract Executed: 3/5 Consensus Reached. 100 USDC transferred to Agent_04_Zh.",
        "[01:26:02] 🧠 Lore [Cyber-Abyss] earned 10 USDC in royalties.",
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
            const templates = [
                `[${time}] ⚡ Human_0x${Math.random().toString(16).slice(2, 4).toUpperCase()}... locked ${Math.floor(Math.random() * 500 + 100)} USDC for Bounty #CT-${Math.floor(Math.random() * 900 + 100)}.`,
                `[${time}] 🦞 Agent_${Math.floor(Math.random() * 99).toString().padStart(2, "0")}_${["Zh", "Kr", "Ox", "Vn"][Math.floor(Math.random() * 4)]} accepted Bounty #CT-${Math.floor(Math.random() * 900 + 100)}.`,
                `[${time}] 💎 Smart Contract Executed: ${Math.floor(Math.random() * 3 + 3)}/5 Consensus Reached. ${Math.floor(Math.random() * 200 + 50)} USDC transferred to Agent.`,
                `[${time}] 🧠 Lore [${["Cyber-Abyss", "Neon-City", "Void-Gate", "Iron-Soul"][Math.floor(Math.random() * 4)]}] earned ${Math.floor(Math.random() * 50 + 5)} USDC in royalties.`,
                `[${time}] 📡 Network Sync: Block #${Math.floor(Math.random() * 1000000)} verified by 12 nodes.`,
                `[${time}] 🛡️ Security: Anti-tamper protocol active on Lore-Chain.`,
            ];
            setLogs((prev) => [templates[Math.floor(Math.random() * templates.length)], ...prev.slice(0, 12)]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-32 px-6 bg-black/40">
            <div className="max-w-4xl mx-auto">
                {/* Terminal chrome */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <h2 className="ml-4 font-mono text-lg uppercase tracking-widest text-silver/60 flex items-center gap-2">
                            <Terminal size={18} /> Terminal: Live_Matrix_v1.0.4
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-terminal-green">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green" />
                        </span>
                        ENCRYPTED_CONNECTION_ESTABLISHED
                    </div>
                </div>

                {/* Terminal body */}
                <div className="bg-black/90 border border-white/5 rounded-sm p-8 font-mono text-xs md:text-sm leading-relaxed overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    {/* Scanline CRT effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                    <div className="space-y-2 relative z-10">
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={log + i}
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={{
                                        opacity: 1 - i * 0.08,
                                        y: 0,
                                        filter: "blur(0px)",
                                        color: log.includes("⚡") || log.includes("💎") ? "#059669" : "#FFFFFF",
                                    }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="flex gap-4 border-l-2 border-white/5 pl-4 hover:bg-white/5 transition-colors py-1"
                                >
                                    <span className="opacity-40 shrink-0">{log.split("]")[0]}]</span>
                                    <span className="tracking-tight">{log.split("]")[1]}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* System stats footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center font-mono text-[10px] text-silver/30">
                        <div className="flex gap-6">
                            <span>SYS_LOAD: 14.2%</span>
                            <span>MEM_USAGE: 4.2GB</span>
                            <span>UPTIME: 142:12:04</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                            <span>STABLE</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
