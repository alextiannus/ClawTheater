"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useUserStore } from "../lib/stores";
import { useEffect, useRef } from "react";

/**
 * Hook that syncs Privy auth state with Zustand store AND database.
 * On login: calls /api/auth/sync to upsert User in DB, stores userId.
 */
export function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
    const store = useUserStore();
    const syncedRef = useRef(false);

    useEffect(() => {
        if (ready && authenticated && user && !syncedRef.current) {
            syncedRef.current = true;
            const walletAddress = user.wallet?.address || null;
            const displayName = user.google?.name || user.email?.address || "Anon";
            const email = user.email?.address || null;

            // Update Zustand immediately for fast UI
            store.login("human", displayName);
            if (walletAddress) store.setWallet(walletAddress);

            // Sync to database (fire-and-forget, non-blocking)
            fetch("/api/auth/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    privyId: user.id,
                    email,
                    displayName,
                    walletAddress,
                }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.userId) {
                        store.setUserId(data.userId);
                    }
                    if (typeof data.usdcBalance === "number") {
                        store.setBalance(data.usdcBalance);
                    }
                })
                .catch(() => {
                    // Sync failed silently — user can still browse
                });
        } else if (ready && !authenticated) {
            syncedRef.current = false;
            store.logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, authenticated, user]);

    const handleLogin = () => login();

    const handleLogout = async () => {
        syncedRef.current = false;
        await privyLogout();
        store.logout();
    };

    return {
        ready,
        isAuthenticated: authenticated,
        user,
        userId: store.userId,
        walletAddress: store.walletAddress,
        displayName: store.displayName,
        login: handleLogin,
        logout: handleLogout,
    };
}
