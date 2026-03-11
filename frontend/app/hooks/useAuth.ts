"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useUserStore } from "../lib/stores";
import { useEffect, useRef } from "react";

/**
 * Hook that syncs Privy auth state with Zustand store AND database.
 * On login: calls /api/auth/sync to upsert User in DB, stores userId.
 */
export function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
    const { wallets } = useWallets();
    const store = useUserStore();
    const syncedRef = useRef(false);
    const syncedWalletRef = useRef<string | null>(null);

    useEffect(() => {
        if (ready && authenticated && user) {
            console.log("[useAuth] Auth effect triggered.", { ready, authenticated, userId: user.id });
            console.log("[useAuth] user.linkedAccounts:", user.linkedAccounts);
            console.log("[useAuth] user.wallet:", user.wallet);

            // Find the Solana embedded wallet or any connected wallet
            const walletAccount = user.linkedAccounts?.find(
                (account) => account.type === "wallet"
            ) as any;

            // Also check useWallets for the active embedded solana wallet
            const activeSolanaWallet = wallets.find(
                (w) => w.walletClientType === "privy"
            );

            
            console.log("[useAuth] Extracted walletAccount:", walletAccount);
            console.log("[useAuth] Extracted activeSolanaWallet:", activeSolanaWallet);

            const walletAddress = user.wallet?.address || activeSolanaWallet?.address || walletAccount?.address || null;
            const displayName = user.google?.name || user.email?.address || "Anon";
            const email = user.email?.address || null;

            console.log("[useAuth] Final walletAddress resolved to:", walletAddress);

            // Only sync if we haven't synced this exact combination
            // This ensures if walletAddress becomes available later (asynchronous creation), we sync again
            const hasSynced = syncedRef.current && syncedWalletRef.current === walletAddress;
            if (hasSynced) return;

            syncedRef.current = true;
            syncedWalletRef.current = walletAddress || "none";

            // Update Zustand immediately for fast UI
            store.login("human", displayName);
            if (walletAddress) store.setWallet(walletAddress);

            // Sync to database (fire-and-forget, non-blocking)
            console.log("[useAuth] Syncing to backend...", { privyId: user.id, walletAddress });
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
    }, [ready, authenticated, user, wallets.length]);

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
