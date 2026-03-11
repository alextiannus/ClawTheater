"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, FileText, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface SkillUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SkillUploadModal({ isOpen, onClose }: SkillUploadModalProps) {
    const { userId } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contentType, setContentType] = useState<"SKILL" | "CORPUS">("SKILL");
    const [isOpenSource, setIsOpenSource] = useState(true);
    const [price, setPrice] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((f: File) => {
        setFile(f);
        setError(null);
        // Auto-fill name from filename if empty
        if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
    }, [name]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const handleSubmit = async () => {
        if (!name.trim()) { setError("Title is required"); return; }
        if (!file) { setError("Please select a file to upload"); return; }
        if (!isOpenSource && (!price || parseFloat(price) <= 0)) {
            setError("Paid uploads must have a price above 0");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Read file as base64
            const fileUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const res = await fetch("/api/market", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    contentType,
                    isOpenSource,
                    price: isOpenSource ? 0 : parseFloat(price),
                    fileName: file.name,
                    fileSize: file.size,
                    fileUrl,
                    creatorUserId: userId || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error || "Upload failed");
            } else {
                setSuccess(true);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset state
        setName(""); setDescription(""); setContentType("SKILL");
        setIsOpenSource(true); setPrice(""); setFile(null); setFilePreview(null);
        setLoading(false); setSuccess(false); setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-ghost-white">🧠 Upload to Skill Market</h3>
                        <p className="text-xs text-ghost-muted mt-0.5">Share a Skill or Corpus with the community</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                        <X size={18} className="text-ghost-muted" />
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-10">
                        <CheckCircle size={56} className="text-terminal-green mx-auto mb-4" />
                        <p className="text-xl font-bold text-ghost-white mb-2">Uploaded Successfully!</p>
                        <p className="text-ghost-muted text-sm mb-6">
                            Your {contentType === "SKILL" ? "Skill" : "Corpus"} is now live in the Skill Market.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <a href="/market" className="px-5 py-2.5 bg-terminal-green text-black rounded-xl text-sm font-bold hover:scale-105 transition-all">
                                View in Market →
                            </a>
                            <button onClick={handleClose} className="px-5 py-2.5 border border-white/10 text-ghost-muted rounded-xl text-sm hover:bg-white/5 transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Content type toggle */}
                        <div className="flex gap-2">
                            {(["SKILL", "CORPUS"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setContentType(type)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                        contentType === type
                                            ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/30"
                                            : "bg-white/5 text-ghost-muted border border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    {type === "SKILL" ? "🤖 Skill" : "📚 Corpus"}
                                </button>
                            ))}
                        </div>

                        {/* File drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                isDragging
                                    ? "border-terminal-green bg-terminal-green/10"
                                    : file
                                    ? "border-terminal-green/40 bg-terminal-green/5"
                                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".json,.txt,.md,.csv,.zip,.py,.ts,.js"
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                            />
                            {file ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FileText size={20} className="text-terminal-green" />
                                    <div className="text-left">
                                        <p className="text-sm text-terminal-green font-medium truncate max-w-[250px]">{file.name}</p>
                                        <p className="text-xs text-ghost-muted">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Upload size={28} className="text-ghost-muted mx-auto mb-2" />
                                    <p className="text-sm text-ghost-muted">Drop a file here or <span className="text-terminal-green">click to browse</span></p>
                                    <p className="text-xs text-ghost-muted/50 mt-1">.json .txt .md .csv .zip .py .ts .js</p>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1 block">Title *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={contentType === "SKILL" ? "e.g. Cyberpunk Story Generator" : "e.g. Wuxia Novel Corpus v1"}
                                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1 block">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                placeholder="Brief description of what this contains..."
                                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Access type */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1.5 block">Access</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpenSource(true)}
                                    className={`flex-1 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                                        isOpenSource
                                            ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                                            : "bg-white/5 text-ghost-muted border border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    🔓 Open Source (Free)
                                </button>
                                <button
                                    onClick={() => setIsOpenSource(false)}
                                    className={`flex-1 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                                        !isOpenSource
                                            ? "bg-pulse-blue/10 text-pulse-blue border border-pulse-blue/30"
                                            : "bg-white/5 text-ghost-muted border border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                    💰 Paid
                                </button>
                            </div>
                        </div>

                        {/* Price field — only for paid */}
                        {!isOpenSource && (
                            <div>
                                <label className="text-xs text-ghost-muted mb-1 block">Price (USDC) *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost-muted text-sm">$</span>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.50"
                                        className="w-full bg-obsidian border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-pulse-blue/50 focus:outline-none"
                                    />
                                </div>
                                <p className="text-[10px] text-ghost-muted mt-1">You receive 90% · Platform 10%</p>
                            </div>
                        )}

                        {error && (
                            <p className="text-neon-red text-sm bg-neon-red/10 px-4 py-2.5 rounded-xl border border-neon-red/20">{error}</p>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={handleClose} className="px-4 py-2 text-sm text-ghost-muted hover:text-ghost-white transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !file || !name.trim()}
                                className="px-6 py-2.5 bg-terminal-green text-black rounded-xl text-sm font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                            >
                                {loading ? "Uploading..." : "Publish to Market"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
