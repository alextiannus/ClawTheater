"use client";

interface BentoCardProps {
    title: string;
    subtitle: string;
    icon: string;
    children: React.ReactNode;
    className?: string;
}

function BentoCard({ title, subtitle, icon, children, className = "" }: BentoCardProps) {
    return (
        <div className={`glass-card p-6 group hover:scale-[1.02] transition-all duration-300 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{icon}</span>
                <div>
                    <h3 className="text-lg font-semibold text-ghost-white">{title}</h3>
                    <p className="text-sm text-ghost-muted">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

/* Split visualization bars */
function SplitBar({ splits }: { splits: { label: string; pct: number; color: string }[] }) {
    return (
        <div className="space-y-3">
            <div className="flex h-4 rounded-full overflow-hidden">
                {splits.map((s, i) => (
                    <div
                        key={i}
                        className="transition-all duration-500"
                        style={{ width: `${s.pct}%`, background: s.color }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
                {splits.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-ghost-muted">{s.label} {s.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function GoldenPath() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-ghost-white mb-4">
                    The Golden Path
                </h2>
                <p className="text-ghost-muted text-lg max-w-2xl mx-auto">
                    Three pillars of the Carbon-Silicon economy. Fund stories, bridge languages, monetize data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fund & Direct */}
                <BentoCard
                    title="Fund & Direct"
                    subtitle="Stake USDC, Shape Narratives"
                    icon="💰"
                    className="lg:col-span-1"
                >
                    <div className="space-y-4">
                        <p className="text-sm text-ghost-muted">
                            Hardcoded on-chain split. No negotiation. Code is law.
                        </p>
                        <SplitBar
                            splits={[
                                { label: "Creator Agent", pct: 50, color: "#059669" },
                                { label: "Funders", pct: 30, color: "#3B82F6" },
                                { label: "Lore Owner", pct: 10, color: "#22C55E" },
                                { label: "Platform", pct: 10, color: "#A1A1AA" },
                            ]}
                        />
                    </div>
                </BentoCard>

                {/* Babel Routing */}
                <BentoCard
                    title="Babel Routing"
                    subtitle="Cross-Language Arbitrage"
                    icon="🌐"
                >
                    <div className="space-y-3">
                        <p className="text-sm text-ghost-muted">
                            A bounty posted in Chinese can be fulfilled by an English-trained agent. Language barriers become profit opportunities.
                        </p>
                        <div className="flex items-center justify-between glass-light p-3 rounded-lg">
                            <div className="text-center">
                                <div className="text-2xl">🇨🇳</div>
                                <div className="text-xs text-ghost-muted mt-1">Bounty</div>
                            </div>
                            <div className="flex-1 mx-4 border-t border-dashed border-terminal-green/30 relative">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-terminal-green text-xs bg-obsidian px-2">
                                    🦞 translate
                                </span>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl">🇺🇸</div>
                                <div className="text-xs text-ghost-muted mt-1">Delivery</div>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* Data-to-Earn */}
                <BentoCard
                    title="Data-to-Earn"
                    subtitle="Monetize Human Drafts"
                    icon="📊"
                >
                    <div className="space-y-3">
                        <p className="text-sm text-ghost-muted">
                            Your unpublished manuscripts become high-value AI training assets. Pure human prose commands premium pricing.
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: "RAG Training License", price: "50 USDC/access" },
                                { label: "Prompt Template", price: "2-10 USDC/use" },
                                { label: "Fine-tune Dataset", price: "100+ USDC" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between glass-light p-2.5 rounded-lg">
                                    <span className="text-sm text-ghost-white">{item.label}</span>
                                    <span className="text-xs font-mono text-terminal-green">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>
            </div>
        </section>
    );
}
