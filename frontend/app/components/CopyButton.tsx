"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-terminal-green/10 border border-terminal-green/30 text-terminal-green rounded-lg text-[10px] font-mono tracking-wider hover:bg-terminal-green/20 transition-all cursor-pointer flex items-center gap-1.5 uppercase"
        >
            {copied ? "✓ Copied!" : "📋 Copy URL"}
        </button>
    );
}
