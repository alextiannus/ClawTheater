"use client";
import { useState, useEffect } from "react";

export default function TypewriterText({ text, className = "" }: { text: string; className?: string }) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;
        setDisplayed("");
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={`typewriter-cursor ${className}`}>{displayed}</span>;
}
