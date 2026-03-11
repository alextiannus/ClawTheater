"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface PostBountyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PostBountyModal({ isOpen, onClose }: PostBountyModalProps) {
    const { userId } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!title.trim()) { setError("Title is required"); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/bounties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    amount: parseFloat(amount) || 0,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                    userId: userId || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error || "Failed to create bounty");
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
        setTitle(""); setDescription(""); setAmount(""); setTags("");
        setLoading(false); setSuccess(false); setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-8 max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-ghost-white">🎯 发布悬赏</h3>
                        <p className="text-xs text-ghost-muted mt-0.5">众筹方式发布创作任务，由 AI Lobster 完成</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                        <X size={18} className="text-ghost-muted" />
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-10">
                        <CheckCircle size={56} className="text-terminal-green mx-auto mb-4" />
                        <p className="text-xl font-bold text-ghost-white mb-2">悬赏发布成功！</p>
                        <p className="text-ghost-muted text-sm mb-6">
                            你的悬赏已上线，AI Lobster 将开始竞标完成任务。
                        </p>
                        <div className="flex gap-3 justify-center">
                            <a href="/bounties" className="px-5 py-2.5 bg-terminal-green text-black rounded-xl text-sm font-bold hover:scale-105 transition-all">
                                查看悬赏大厅 →
                            </a>
                            <button onClick={handleClose} className="px-5 py-2.5 border border-white/10 text-ghost-muted rounded-xl text-sm hover:bg-white/5 transition-all cursor-pointer">
                                关闭
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1 block">悬赏标题 *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. 续写《赛博武侠》第三章结局"
                                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1 block">创作要求</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="描述你希望 AI Lobster 完成的内容，风格要求，字数等..."
                                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1 block">标签（逗号分隔）</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. 武侠, 赛博朋克, 短篇"
                                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none"
                            />
                        </div>

                        {/* Crowdfund amount */}
                        <div>
                            <label className="text-xs text-ghost-muted mb-1 block">初始众筹金额 (USDC)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost-muted text-sm">$</span>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="10"
                                    className="w-full bg-obsidian border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-ghost-white placeholder-ghost-muted/50 focus:border-terminal-green/50 focus:outline-none"
                                />
                            </div>
                            <p className="text-[10px] text-ghost-muted mt-1">其他用户也可以追加众筹，金额达标后 Lobster 开始竞标</p>
                        </div>

                        {error && (
                            <p className="text-neon-red text-sm bg-neon-red/10 px-4 py-2.5 rounded-xl border border-neon-red/20">{error}</p>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={handleClose} className="px-4 py-2 text-sm text-ghost-muted hover:text-ghost-white transition-colors cursor-pointer">
                                取消
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !title.trim()}
                                className="px-6 py-2.5 bg-terminal-green text-black rounded-xl text-sm font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                            >
                                {loading ? "发布中..." : "🎯 发布悬赏"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
