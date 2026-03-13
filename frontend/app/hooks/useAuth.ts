"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useUserStore } from "../lib/stores";
import { useEffect, useRef } from "react";

export function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
    const { wallets } = useWallets();
    const store = useUserStore();
    const syncedRef = useRef(false);
    const syncedWalletRef = useRef<string | null>(null);

    useEffect(() => {
        if (ready && authenticated && user) {
            const walletAccount = user.linkedAccounts?.find(
                (account) => account.type === "wallet" && (account as any).walletClientType === "privy"
            ) as any;
            
            const fallbackLinkedWallet = user.linkedAccounts?.find(
                (account) => account.type === "wallet" && account.address && account.address.length >= 32 && account.address.length <= 44 && !account.address.startsWith("0x")
            ) as any;

            const activeSolanaWallet = wallets.find(
                (w) => w.walletClientType === "privy" && w.address && !w.address.startsWith("0x")
            );

            const walletAddress = user.wallet?.address || walletAccount?.address || fallbackLinkedWallet?.address || activeSolanaWallet?.address || null;

            const displayName = user.google?.name || user.email?.address || "Anon";
            const email = user.email?.address || null;

            const hasSynced = syncedRef.current && syncedWalletRef.current === walletAddress;
            if (hasSynced) return;

            syncedRef.current = true;
            syncedWalletRef.current = walletAddress || "none";

            store.login("human", displayName);
            if (walletAddress) store.setWallet(walletAddress);

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
                .catch(() => {});
        } else if (ready && !authenticated) {
            syncedRef.current = false;
            store.logout();
        }
    }, [ready, authenticated, user, wallets.length, store]);

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
        syncAuth: () => {} // Shim to avoid breaking other components using it on mount
    };
}

