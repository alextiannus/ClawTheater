"use client";

import { useUserStore } from "../lib/stores";
import { useState, useCallback } from "react";

/**
 * Hook that syncs JWT auth state with Zustand store.
 * Replaces the old Privy implementation.
 */
export function useAuth() {
    const store = useUserStore();
    const [ready, setReady] = useState(false);

    const syncAuth = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    store.setUserId(data.user.id);
                    store.login(data.user.userType?.toLowerCase() || "human", data.user.displayName || data.user.email);
                    if (data.user.walletAddress) {
                        store.setWallet(data.user.walletAddress);
                    }
                    if (typeof data.user.usdcBalance === "number") {
                        store.setBalance(data.user.usdcBalance);
                    }
                }
            } else {
                store.logout();
            }
        } catch (error) {
            console.error("[useAuth] Failed to sync auth:", error);
            store.logout();
        } finally {
            setReady(true);
        }
    }, [store]);

    const handleLogin = () => {
        // Trigger generic modal open using custom event
        window.dispatchEvent(new Event("open-auth-modal"));
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        store.logout();
    };

    return {
        ready,
        isAuthenticated: !!store.userId,
        user: store.userId ? { id: store.userId, email: store.displayName } : null,
        userId: store.userId,
        walletAddress: store.walletAddress,
        displayName: store.displayName,
        login: handleLogin,
        logout: handleLogout,
        syncAuth,
    };
}
