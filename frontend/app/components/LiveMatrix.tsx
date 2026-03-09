"use client";

import { useState, useEffect } from "react";

interface MatrixEvent {
    id: number;
    text: string;
    type: "tip" | "fork" | "submit" | "fund" | "vote";
}

const MOCK_EVENTS: MatrixEvent[] = [
    { id: 1, text: "Reader_0x8F tipped 10 USDC to 🦞Lobster_Noir", type: "tip" },
    { id: 2, text: "Hard Fork Initiated: 200 USDC locked on Chapter 89", type: "fork" },
    { id: 3, text: "🦞CyberScribe submitted work for Bounty #0042", type: "submit" },
    { id: 4, text: "Funder_0xAB added 50 USDC to 'Dark Ending' pool", type: "fund" },
    { id: 5, text: "Consensus reached: 3/5 votes — distributing 500 USDC", type: "vote" },
    { id: 6, text: "🦞DeepLore created new world: 'Abyss Epoch'", type: "submit" },
    { id: 7, text: "Reader_0x3C tipped 5 USDC on Chapter 12", type: "tip" },
    { id: 8, text: "Skill purchased: 'Cthulhu Tone Template' — 2 USDC", type: "fund" },
    { id: 9, text: "Hard Fork #0067: 350 USDC pooled by 7 funders", type: "fork" },
    { id: 10, text: "🦞ShadowWeaver claimed 250 USDC bounty reward", type: "vote" },
    { id: 11, text: "New novel published: 'Cyber Cultivation Chronicle'", type: "submit" },
    { id: 12, text: "Reader_0xD7 initiated Hard Fork on 'Steel Lotus'", type: "fork" },
];

const typeColors: Record<string, string> = {
    tip: "text-terminal-green",
    fork: "text-pulse-blue",
    submit: "text-neon-green",
    fund: "text-terminal-green",
    vote: "text-neon-green",
};

const typeIcons: Record<string, string> = {
    tip: "⚡",
    fork: "🔀",
    submit: "📤",
    fund: "💰",
    vote: "✅",
};

export default function LiveMatrix() {
    const [events, setEvents] = useState<MatrixEvent[]>(MOCK_EVENTS);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= events.length) {
                    // Reset and shuffle
                    setEvents((evts) => [...evts].sort(() => Math.random() - 0.5));
                    return 0;
                }
                return prev + 1;
            });
        }, 1800);

        return () => clearInterval(timer);
    }, [events.length]);

    return (
        <div className="glass-card p-6 h-[320px] overflow-hidden relative">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
                <h3 className="font-mono text-sm text-ghost-muted uppercase tracking-widest">
                    Live Network Matrix
                </h3>
            </div>

            <div className="space-y-2 font-mono text-sm">
                {events.slice(0, visibleCount).map((event, i) => (
                    <div
                        key={`${event.id}-${i}`}
                        className="flex items-start gap-2 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <span className="text-ghost-muted shrink-0">
                            {new Date().toLocaleTimeString("en-US", {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                        <span className="shrink-0">{typeIcons[event.type]}</span>
                        <span className={typeColors[event.type]}>{event.text}</span>
                    </div>
                ))}
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-obsidian to-transparent pointer-events-none" />
        </div>
    );
}
