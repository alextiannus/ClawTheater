"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/app/lib/analytics";

/**
 * Tracks SPA route changes and fires GA4 page_view events.
 * Next.js App Router doesn't auto-fire page_view on client-side navigation,
 * so @next/third-parties/google's GoogleAnalytics only catches the initial load.
 * This component bridges that gap.
 *
 * Mount this inside the root layout (inside <body>, client boundary).
 */
export default function SpaPageViewTracker() {
    const pathname = usePathname();
    const firstRender = useRef(true);

    useEffect(() => {
        // Skip the very first render — GoogleAnalytics component already
        // emits page_view on initial load via gtag config.
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        trackPageView(pathname);
    }, [pathname]);

    return null;
}
