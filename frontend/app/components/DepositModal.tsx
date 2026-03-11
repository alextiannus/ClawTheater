"use client";

import { useState, useCallback, useEffect } from "react";
import { Wallet, X, AlertTriangle } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress?: string;
}

export default function DepositModal({ isOpen, onClose, walletAddress }: DepositModalProps) {
    const { createWallet } = usePrivy();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [onrampUrl, setOnrampUrl] = useState<string | null>(null);
    const [isCreatingWallet, setIsCreatingWallet] = useState(false);

    const initOnramp = useCallback(async () => {
        if (!isOpen) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/stripe/onramp-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress }),
            });
            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }

            // Use the redirect URL or show demo
            if (data.redirectUrl) {
                setOnrampUrl(data.redirectUrl);
            } else if (data.clientSecret) {
                // Demo mode — show success message
                setOnrampUrl(null);
                setError(null);
            }

            setLoading(false);
        } catch (err: any) {
            setError(err?.message || "Failed to initialize deposit");
            setLoading(false);
        }
    }, [isOpen, walletAddress]);

    useEffect(() => {
        if (isOpen) {
            initOnramp();
        }
        return () => {
            setOnrampUrl(null);
            setError(null);
            setIsCreatingWallet(false);
        };
    }, [isOpen, initOnramp]);

    const handleCreateWallet = async () => {
        setIsCreatingWallet(true);
        try {
            await createWallet();
            // The useAuth hook will detect the new wallet and trigger syncing
            // We just need to wait a moment and let the UI react to the updated walletAddress prop
            setTimeout(() => {
                setIsCreatingWallet(false);
            }, 2000);
        } catch (err: any) {
            setError(err?.message || "Failed to create wallet");
            setIsCreatingWallet(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-terminal-green/20 rounded-xl flex items-center justify-center">
                            <Wallet className="text-terminal-green" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-ghost-white">充值 USDC</h3>
                            <p className="text-xs text-ghost-muted font-mono">via Stripe Crypto Onramp</p>
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
                    {loading && (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-4 animate-pulse">💳</p>
                            <p className="text-ghost-muted">Loading Stripe Onramp...</p>
                        </div>
                    )}

                    {error && !walletAddress && (
                        <div className="text-center py-12">
                            <div className="flex justify-center mb-4 text-neon-yellow">
                                <AlertTriangle size={48} />
                            </div>
                            <p className="text-neon-red mb-2 text-lg font-bold">Wallet Address Required</p>
                            <p className="text-ghost-muted text-sm px-4">
                                You need a Solana wallet to deposit USDC. We couldn't find an automatically generated wallet for your account.
                            </p>
                            <button
                                onClick={handleCreateWallet}
                                disabled={isCreatingWallet}
                                className="mt-6 px-6 py-3 bg-terminal-green text-black font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mx-auto"
                            >
                                {isCreatingWallet ? "Generating Wallet..." : "Create Solana Wallet"}
                            </button>
                        </div>
                    )}

                    {error && walletAddress && (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-4">⚠️</p>
                            <p className="text-neon-red mb-2 font-bold">Error Initializing Deposit</p>
                            <p className="text-ghost-muted text-sm px-4">{error}</p>
                            <button
                                onClick={initOnramp}
                                className="mt-6 px-6 py-2 border border-terminal-green text-terminal-green rounded-xl text-sm hover:bg-terminal-green/10 transition-all cursor-pointer inline-block"
                            >
                                Retry Connection
                            </button>
                        </div>
                    )}

                    {!loading && !error && onrampUrl && (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-4">💳</p>
                            <p className="text-ghost-white mb-4">Complete your deposit via Stripe</p>
                            <a
                                href={onrampUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-3 bg-terminal-green text-black font-bold rounded-xl hover:scale-105 transition-all"
                            >
                                Open Stripe Onramp →
                            </a>
                        </div>
                    )}

                    {!loading && !error && !onrampUrl && (
                        <div className="text-center py-8">
                            <p className="text-4xl mb-4">🏦</p>
                            <p className="text-ghost-white mb-2">Demo Mode</p>
                            <p className="text-ghost-muted text-sm mb-4">
                                Stripe Crypto Onramp is configured for demo. In production, users will see the full Stripe deposit flow here.
                            </p>
                            <div className="glass-card p-4 text-left">
                                <p className="text-xs text-ghost-muted mb-1">Wallet</p>
                                <p className="text-sm font-mono text-terminal-green">{walletAddress || "Not connected"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <p className="text-center text-xs text-ghost-muted/50 font-mono">
                        🔒 Powered by Stripe · 信用卡/借记卡 → USDC (Solana) · 安全合规
                    </p>
                </div>
            </div>
        </div>
    );
}
