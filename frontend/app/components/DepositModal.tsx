"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { loadStripeOnramp } from "@stripe/crypto";
import { Wallet, X } from "lucide-react";

const stripeOnrampPromise = loadStripeOnramp(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress?: string;
}

export default function DepositModal({ isOpen, onClose, walletAddress }: DepositModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onrampContainerRef = useRef<HTMLDivElement>(null);
    const onrampElementRef = useRef<any>(null);

    const initOnramp = useCallback(async () => {
        if (!isOpen) return;

        setLoading(true);
        setError(null);

        try {
            // Get client secret from our API
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

            // Initialize Stripe Onramp widget
            const stripeOnramp = await stripeOnrampPromise;
            if (!stripeOnramp) {
                setError("Failed to load Stripe");
                setLoading(false);
                return;
            }

            // Create the onramp element
            const onrampElement = stripeOnramp.createSession({
                clientSecret: data.clientSecret,
                appearance: {
                    theme: "dark",
                },
            });

            onrampElementRef.current = onrampElement;

            // Listen for completion
            onrampElement.addEventListener("onramp_session_updated", (e: any) => {
                if (e.payload?.session?.status === "fulfillment_complete") {
                    onClose();
                }
            });

            // Mount the element
            if (onrampContainerRef.current) {
                onrampElement.mount(onrampContainerRef.current);
            }

            setLoading(false);
        } catch (err: any) {
            setError(err?.message || "Failed to initialize deposit");
            setLoading(false);
        }
    }, [isOpen, walletAddress, onClose]);

    useEffect(() => {
        if (isOpen) {
            initOnramp();
        }

        return () => {
            // Cleanup onramp element on unmount/close
            if (onrampElementRef.current) {
                try {
                    onrampElementRef.current.destroy?.();
                } catch { }
                onrampElementRef.current = null;
            }
        };
    }, [isOpen, initOnramp]);

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

                    {error && (
                        <div className="text-center py-12">
                            <p className="text-4xl mb-4">⚠️</p>
                            <p className="text-neon-red mb-2">Error</p>
                            <p className="text-ghost-muted text-sm">{error}</p>
                            <button
                                onClick={initOnramp}
                                className="mt-4 px-4 py-2 bg-terminal-green/10 text-terminal-green rounded-xl text-sm hover:bg-terminal-green/20 transition-all cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Stripe Onramp Widget mounts here */}
                    <div
                        ref={onrampContainerRef}
                        className="min-h-[400px]"
                        style={{ display: loading || error ? "none" : "block" }}
                    />
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
