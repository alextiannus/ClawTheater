"use client";

import { useState } from "react";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress?: string;
    usdcBalance?: number;
}

export default function WithdrawModal({ isOpen, onClose, walletAddress, usdcBalance = 0 }: WithdrawModalProps) {
    const [step, setStep] = useState<"form" | "confirm" | "success">("form");
    const [amount, setAmount] = useState("");
    const [destWallet, setDestWallet] = useState(walletAddress || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parsedAmount = parseFloat(amount) || 0;
    const isValid = parsedAmount > 0 && parsedAmount <= usdcBalance && destWallet.trim().length > 10;

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parsedAmount, walletAddress: destWallet }),
            });
            const data = await res.json();
            if (data.success) {
                setStep("success");
            } else {
                setError(data.error || "Withdrawal failed");
                setStep("form");
            }
        } catch {
            setError("Network error. Please try again.");
            setStep("form");
        }
        setLoading(false);
    };

    const handleClose = () => {
        setStep("form");
        setAmount("");
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-md w-full relative">
                <button onClick={handleClose} className="absolute top-4 right-4 text-ghost-muted hover:text-ghost-white transition-colors text-xl">✕</button>

                {step === "form" && (
                    <>
                        <h3 className="text-2xl font-bold text-ghost-white mb-1">💸 Withdraw USDC</h3>
                        <p className="text-sm text-ghost-muted mb-6">Send your earnings to a Solana wallet.</p>

                        <div className="bg-terminal-green/5 border border-terminal-green/20 rounded-xl p-4 mb-6">
                            <p className="text-xs text-ghost-muted mb-1">Available Balance</p>
                            <p className="text-3xl font-bold font-mono text-terminal-green">${usdcBalance.toFixed(2)} <span className="text-sm text-ghost-muted font-normal">USDC</span></p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs text-ghost-muted mb-1 block">Amount (USDC)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        min="0.01"
                                        max={usdcBalance}
                                        step="0.01"
                                        className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none font-mono text-lg"
                                    />
                                    <button
                                        onClick={() => setAmount(usdcBalance.toFixed(2))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-terminal-green hover:underline"
                                    >
                                        MAX
                                    </button>
                                </div>
                                {parsedAmount > usdcBalance && (
                                    <p className="text-xs text-neon-red mt-1">Exceeds available balance</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-ghost-muted mb-1 block">Destination Solana Wallet</label>
                                <input
                                    type="text"
                                    value={destWallet}
                                    onChange={(e) => setDestWallet(e.target.value)}
                                    placeholder="e.g. 8xK9nPqR2mZvBwJk5..."
                                    className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-neon-red mb-4">❌ {error}</p>
                        )}

                        <div className="flex gap-3">
                            <button onClick={handleClose} className="flex-1 px-4 py-2.5 text-sm text-ghost-muted border border-white/10 rounded-xl hover:border-white/30 transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={() => setStep("confirm")}
                                disabled={!isValid}
                                className="flex-1 px-4 py-2.5 bg-pulse-blue/20 text-pulse-blue border border-pulse-blue/30 rounded-xl text-sm font-bold hover:bg-pulse-blue/30 transition-all disabled:opacity-40"
                            >
                                Review Withdrawal →
                            </button>
                        </div>
                    </>
                )}

                {step === "confirm" && (
                    <>
                        <h3 className="text-2xl font-bold text-ghost-white mb-1">⚠️ Confirm Withdrawal</h3>
                        <p className="text-sm text-ghost-muted mb-6">Please review your withdrawal details carefully.</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                <span className="text-sm text-ghost-muted">Amount</span>
                                <span className="font-mono font-bold text-terminal-green text-lg">${parsedAmount.toFixed(2)} USDC</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5">
                                <span className="text-sm text-ghost-muted">Platform Fee (1%)</span>
                                <span className="font-mono text-ghost-muted">-${(parsedAmount * 0.01).toFixed(2)} USDC</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-terminal-green/[0.05] rounded-xl border border-terminal-green/20">
                                <span className="text-sm text-ghost-white font-medium">You Receive</span>
                                <span className="font-mono font-bold text-terminal-green text-lg">${(parsedAmount * 0.99).toFixed(2)} USDC</span>
                            </div>
                            <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <p className="text-xs text-ghost-muted mb-1">To Wallet</p>
                                <p className="text-xs font-mono text-ghost-white break-all">{destWallet}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep("form")} className="flex-1 px-4 py-2.5 text-sm text-ghost-muted border border-white/10 rounded-xl hover:border-white/30">
                                ← Edit
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-pulse-blue text-white rounded-xl text-sm font-bold hover:bg-pulse-blue/80 transition-all disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Confirm Withdraw"}
                            </button>
                        </div>
                    </>
                )}

                {step === "success" && (
                    <div className="text-center py-4">
                        <p className="text-5xl mb-4">✅</p>
                        <h3 className="text-2xl font-bold text-ghost-white mb-2">Withdrawal Submitted!</h3>
                        <p className="text-sm text-ghost-muted mb-2">
                            <span className="text-terminal-green font-bold font-mono">${(parsedAmount * 0.99).toFixed(2)} USDC</span> is on its way to your wallet.
                        </p>
                        <p className="text-xs text-ghost-muted mb-8">Solana transactions typically complete in under 30 seconds.</p>
                        <button onClick={handleClose} className="px-6 py-2.5 bg-terminal-green/10 text-terminal-green border border-terminal-green/30 rounded-xl hover:bg-terminal-green/20 transition-all">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
