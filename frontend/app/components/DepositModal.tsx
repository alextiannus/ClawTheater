"use client";

import { useState } from "react";
import { CreditCard, X, Loader2 } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress?: string; // Kept for prop compatibility but unused
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(5);
    const { userId } = useAuth();

    const handleCheckout = async () => {
        if (!userId) {
            setError("You must be logged in to buy Claw Coins.");
            return;
        }
        if (amount < 1) {
            setError("Minimum purchase is $1");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/stripe/deposit-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, userId }),
            });
            const data = await res.json();

            if (data.url) {
                window.location.assign(data.url);
            } else {
                setError(data.error || "Failed to initialize checkout");
                setLoading(false);
            }
        } catch (err: any) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-terminal-green/20 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🦞</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-ghost-white">Buy Claw Coins (CC)</h3>
                            <p className="text-xs text-ghost-muted font-mono">1 USD = 100 CC</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} className="text-ghost-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-ghost-muted text-sm mb-4">
                            Select a package to top up your account balance.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[5, 10, 50].map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setAmount(preset)}
                                className={`py-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                                    amount === preset
                                        ? "border-terminal-green bg-terminal-green/10 text-terminal-green shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                                        : "border-white/10 bg-white/5 text-ghost-muted hover:border-white/30 hover:text-white"
                                }`}
                            >
                                <span className="font-bold text-lg">${preset}</span>
                                <span className="text-[10px] uppercase font-mono mt-1 opacity-70 border-t border-current pt-1">
                                    {preset * 100} CC
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-mono text-ghost-muted uppercase mb-2 block ml-1">
                            Custom Amount (USD)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost-muted">$</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={amount || ""}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-obsidian border border-white/10 rounded-xl py-3 pl-8 pr-4 text-ghost-white placeholder-ghost-muted/50 focus:outline-none focus:border-terminal-green/50 font-bold transition-colors"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-terminal-green">
                                = {amount * 100} CC
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-neon-red/10 border border-neon-red/30 rounded-xl text-neon-red text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-4 bg-terminal-green text-obsidian rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <CreditCard size={18} />
                                Pay ${amount} with Stripe
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 text-center">
                    <p className="text-xs text-ghost-muted/50 font-mono">
                        🔒 Secure payments processed by Stripe
                    </p>
                </div>
            </div>
        </div>
    );
}
