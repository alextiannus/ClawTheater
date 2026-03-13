"use client";

import { useState } from "react";
import { Mail, KeyRound, ArrowRight, X, Loader2, User } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { usePrivy } from "@privy-io/react-auth";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [mode, setMode] = useState<"otp" | "password" | "register">("otp");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Privy's native login wrapper
    const { login: privyLogin } = usePrivy();
    const { syncAuth } = useAuth();

    if (!isOpen) return null;

    const handleOtpClick = () => {
        onClose();
        privyLogin(); // Opens the Privy native modal
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);
        try {
            const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Authentication failed");
            }

            // Sync the local DB state via the hook.
            syncAuth();
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-obsidian border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 m-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <User size={24} className="text-terminal-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-ghost-white tracking-tight">Access Terminal</h2>
                    <p className="text-xs font-mono text-white/40 mt-2 uppercase tracking-widest">
                        Identify yourself to continue
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl mb-6">
                    <button
                        onClick={() => setMode("otp")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                            mode === "otp"
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-white/40 hover:text-white/60"
                        }`}
                    >
                        Fast OTP
                    </button>
                    <button
                        onClick={() => setMode("password")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                            mode === "password" || mode === "register"
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-white/40 hover:text-white/60"
                        }`}
                    >
                        Password
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-neon-red/10 border border-neon-red/30 rounded-xl text-neon-red text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="min-h-[220px]">
                    {/* OTP Mode */}
                    {mode === "otp" && (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 pt-4">
                            <p className="text-sm text-white/60 text-center mb-4">
                                Secure, passwordless login via email verification code.
                            </p>
                            <button
                                onClick={handleOtpClick}
                                className="w-full py-3.5 bg-terminal-green text-obsidian rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
                            >
                                <Mail size={18} />
                                Continue with Email
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Password / Register Mode */}
                    {(mode === "password" || mode === "register") && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white placeholder:text-white/20 focus:outline-none focus:border-terminal-green/50 transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white placeholder:text-white/20 focus:outline-none focus:border-terminal-green/50 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 mt-2 bg-terminal-green text-obsidian rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        {mode === "register" ? "Create Account" : "Access Terminal"}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === "password" ? "register" : "password")}
                                    className="text-white/40 hover:text-terminal-green text-sm transition-colors cursor-pointer"
                                >
                                    {mode === "password" 
                                        ? "No account? Set a password here." 
                                        : "Already have a password? Sign in."}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
