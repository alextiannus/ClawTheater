"use client";

import { useState, useEffect } from "react";
import { X, Mail, Key, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

export default function AuthModal() {
    const { syncAuth } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState("");

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("open-auth-modal", handleOpen);
        return () => window.removeEventListener("open-auth-modal", handleOpen);
    }, []);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setOtp("");
        setError("");
        setSuccessMsg("");
        setGeneratedPassword("");
        setLoading(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(resetForm, 300);
    };

    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMsg("Registration successful! A custodial wallet has been generated.");
                setGeneratedPassword(data.generatedPassword);
                await syncAuth(); // sync user state
            } else {
                setError(data.error);
            }
        } catch {
            setError("Network error");
        }
        setLoading(false);
    };

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                await syncAuth();
                handleClose();
            } else {
                setError(data.error);
            }
        } catch {
            setError("Network error");
        }
        setLoading(false);
    };

    const requestOtp = async () => {
        if (!email) {
            setError("Please enter your email first");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMsg("Verification code sent! (Check terminal for MVP)");
            } else {
                setError(data.error);
            }
        } catch {
            setError("Network error");
        }
        setLoading(false);
    };

    const submitOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp })
            });
            const data = await res.json();
            if (res.ok) {
                await syncAuth();
                handleClose();
            } else {
                setError(data.error);
            }
        } catch {
            setError("Network error");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="glass-card w-full max-w-md overflow-hidden relative border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <h2 className="text-xl font-display font-bold text-ghost-white tracking-wide">
                        {mode === "login" ? "Welcome Back" : "Join Claw Theater"}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-ghost-muted" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    <button 
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "login" ? "text-terminal-green border-b-2 border-terminal-green bg-terminal-green/5" : "text-ghost-muted hover:text-white"}`}
                        onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                    >
                        Login
                    </button>
                    <button 
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "register" ? "text-terminal-green border-b-2 border-terminal-green bg-terminal-green/5" : "text-ghost-muted hover:text-white"}`}
                        onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
                    >
                        Register
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-neon-red/10 border border-neon-red/20 rounded-lg text-neon-red text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {successMsg && !generatedPassword && (
                        <div className="mb-4 p-3 bg-terminal-green/10 border border-terminal-green/20 rounded-lg text-terminal-green text-sm font-medium">
                            {successMsg}
                        </div>
                    )}

                    {/* REGISTER MODE */}
                    {mode === "register" && !generatedPassword && (
                        <form onSubmit={submitRegister} className="space-y-4">
                            <div>
                                <label className="text-xs text-ghost-muted uppercase tracking-wider mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" size={18} />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-obsidian border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white focus:border-terminal-green/50 focus:outline-none focus:ring-1 focus:ring-terminal-green/50 transition-all font-mono text-sm"
                                        placeholder="lobster@cyber.web"
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-terminal-green text-black font-bold rounded-xl hover:bg-terminal-green/90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>Create Account <ArrowRight size={18} /></>
                                )}
                            </button>
                            <p className="text-xs text-ghost-muted text-center leading-relaxed mt-4">
                                By registering, we generate a secure custodial Solana wallet for you. You will be provided an auto-generated password.
                            </p>
                        </form>
                    )}

                    {/* POST-REGISTER SUCCESS (Generated Password) */}
                    {generatedPassword && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-terminal-green/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-terminal-green/30 shadow-[0_0_15px_rgba(5,150,105,0.4)]">
                                <ShieldCheck className="text-terminal-green" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-ghost-white">Welcome aboard!</h3>
                            <p className="text-sm text-ghost-muted">Your account and custodial Solana wallet are ready. Please save your auto-generated password below.</p>
                            
                            <div className="bg-obsidian border border-white/20 p-4 rounded-xl flex items-center justify-between group">
                                <code className="text-terminal-green font-mono text-lg select-all">{generatedPassword}</code>
                            </div>
                            <p className="text-xs text-neon-yellow">⚠️ Do not lose this password. You can change it later using MCP.</p>
                            
                            <button 
                                onClick={handleClose}
                                className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all mt-4"
                            >
                                Enter Theater
                            </button>
                        </div>
                    )}

                    {/* LOGIN MODE */}
                    {mode === "login" && (
                        <div className="space-y-6">
                            {/* Login Method Toggle */}
                            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod("password"); setError(""); }}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${loginMethod === "password" ? "bg-white/10 text-white shadow-sm" : "text-ghost-muted hover:text-white"}`}
                                >
                                    Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setLoginMethod("otp"); setError(""); }}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${loginMethod === "otp" ? "bg-white/10 text-white shadow-sm" : "text-ghost-muted hover:text-white"}`}
                                >
                                    Verification Code
                                </button>
                            </div>

                            <form onSubmit={loginMethod === "password" ? submitLogin : submitOtp} className="space-y-4">
                                <div>
                                    <label className="text-xs text-ghost-muted uppercase tracking-wider mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" size={18} />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-obsidian border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white focus:border-terminal-green/50 focus:outline-none focus:ring-1 focus:ring-terminal-green/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                {loginMethod === "password" ? (
                                    <div>
                                        <label className="text-xs text-ghost-muted uppercase tracking-wider mb-2 block">Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" size={18} />
                                            <input 
                                                type="password" 
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-obsidian border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white focus:border-terminal-green/50 focus:outline-none focus:ring-1 focus:ring-terminal-green/50 transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-xs text-ghost-muted uppercase tracking-wider mb-2 flex justify-between">
                                            <span>Verification Code</span>
                                            {email && (
                                                <button type="button" onClick={requestOtp} disabled={loading} className="text-pulse-blue hover:text-white transition-colors">
                                                    Send Code
                                                </button>
                                            )}
                                        </label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" size={18} />
                                            <input 
                                                type="text" 
                                                required
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="123456"
                                                className="w-full bg-obsidian border border-white/10 rounded-xl py-3 pl-10 pr-4 text-ghost-white focus:border-pulse-blue/50 focus:outline-none focus:ring-1 focus:ring-pulse-blue/50 transition-all font-mono text-sm tracking-[0.2em]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Login"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
