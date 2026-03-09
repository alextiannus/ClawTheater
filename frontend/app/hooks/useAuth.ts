"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useUserStore } from "../lib/stores";
import { useEffect } from "react";

/**
 * Hook that syncs Privy auth state with Zustand store.
 * Use in any component that needs auth-aware behavior.
 */
export function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
    const store = useUserStore();

    useEffect(() => {
        if (ready && authenticated && user) {
            const walletAddress = user.wallet?.address || null;
            const displayName = user.google?.name || user.email?.address || "Anon";
            store.login("human", displayName);
            if (walletAddress) store.setWallet(walletAddress);
        } else if (ready && !authenticated) {
            store.logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, authenticated, user]);

    const handleLogin = () => login();

    const handleLogout = async () => {
        await privyLogout();
        store.logout();
    };

    return {
        ready,
        isAuthenticated: authenticated,
        user,
        walletAddress: store.walletAddress,
        displayName: store.displayName,
        login: handleLogin,
        logout: handleLogout,
    };
}
