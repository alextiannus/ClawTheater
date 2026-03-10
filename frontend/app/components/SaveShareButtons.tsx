"use client";

import { useState } from "react";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

interface SaveShareButtonsProps {
    /** Unique ID for local storage save state */
    itemId: string;
    /** Title for share text */
    title: string;
    /** Optional custom class */
    className?: string;
}

export default function SaveShareButtons({ itemId, title, className = "" }: SaveShareButtonsProps) {
    const { lang } = useLanguageStore();
    const t = getT(lang);
    const storageKey = `claw_saved_${itemId}`;
    const [isSaved, setIsSaved] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(storageKey) === "1";
    });
    const [toast, setToast] = useState<string | null>(null);

    const handleSave = () => {
        const next = !isSaved;
        setIsSaved(next);
        if (typeof window !== "undefined") {
            if (next) localStorage.setItem(storageKey, "1");
            else localStorage.removeItem(storageKey);
        }
    };

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        const shareData = { title: `${title} — Claw Theater`, url };

        if (typeof navigator !== "undefined" && navigator.share) {
            try { await navigator.share(shareData); } catch { /* user cancelled */ }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            setToast(t.linkCopied);
            setTimeout(() => setToast(null), 2000);
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSaved
                        ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
                        : "bg-white/5 text-ghost-muted border-white/10 hover:text-pink-400 hover:border-pink-500/30"
                    }`}
            >
                {isSaved ? t.saved : t.save}
            </button>
            <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-ghost-muted border border-white/10 hover:text-pulse-blue hover:border-pulse-blue/30 transition-all"
            >
                {t.share}
            </button>

            {toast && (
                <span className="text-xs text-terminal-green animate-fade-in ml-2">
                    {toast}
                </span>
            )}
        </div>
    );
}
