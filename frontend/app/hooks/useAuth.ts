"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useUserStore } from "../lib/stores";
import { useEffect, useRef, useState } from "react";

export function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout } = usePrivy();
    const { wallets } = useWallets();
    const store = useUserStore();
    const syncedRef = useRef(false);
    const syncedWalletRef = useRef<string | null>(null);
    const [localAuthChecked, setLocalAuthChecked] = useState(false);

    // Manual sync function to re-fetch local JWT session
    const syncAuth = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (data.authenticated) {
                store.login("human", data.displayName || data.email?.split("@")[0] || "User");
                if (data.userId) store.setUserId(data.userId);
                if (data.walletAddress) store.setWallet(data.walletAddress);
                if (typeof data.usdcBalance === "number") store.setBalance(data.usdcBalance);
                return;
            }
        } catch (e) {
            console.error(e);
        }
        
        // If /me fails and Privy isn't authenticated either, log out
        if (!authenticated && ready) {
             store.logout();
        }
    };

    // Check for local JWT cookie on mount
    useEffect(() => {
        if (!localAuthChecked) {
            syncAuth().finally(() => setLocalAuthChecked(true));
        }
    }, [localAuthChecked]);

    // Privy Sync Effect
    useEffect(() => {
        if (ready && authenticated && user) {
            const walletAccount = user.linkedAccounts?.find(
                (account: any) => account.type === "wallet" && (account as any).walletClientType === "privy"
            ) as any;
            
            const fallbackLinkedWallet = user.linkedAccounts?.find(
                (account: any) => account.type === "wallet" && account.address && account.address.length >= 32 && account.address.length <= 44 && !account.address.startsWith("0x")
            ) as any;

            const activeSolanaWallet = wallets.find(
                (w: any) => w.walletClientType === "privy" && w.address && !w.address.startsWith("0x")
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
        } else if (ready && !authenticated && localAuthChecked) {
            // Only clear sync ref if Privy drops AND we've already checked local auth once
            syncedRef.current = false;
        }
    }, [ready, authenticated, user, wallets.length, store, localAuthChecked]);

    const handleLogin = () => login();

    const handleLogout = async () => {
        syncedRef.current = false;
        await privyLogout();
        
        // Also clear the local JWT cookie
        fetch("/api/auth/me", { method: "POST" }).catch(() => {});
        store.logout();
    };

    return {
        ready,
        isAuthenticated: authenticated || !!store.userId, // Authenticated if either Privy or local store has a userId
        user,
        userId: store.userId,
        walletAddress: store.walletAddress,
        displayName: store.displayName,
        login: handleLogin,
        logout: handleLogout,
        syncAuth 
    };
}

