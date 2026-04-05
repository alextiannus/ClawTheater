"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useUserStore } from "../lib/stores";
import { useEffect, useRef, useState } from "react";
import { setGAUserId, trackSignUp, trackLogin } from '@/app/lib/analytics';

// Detect the actual auth method from a Privy user object
function detectPrivyMethod(user: any): 'email' | 'google' | 'wallet' | 'privy_sync' {
    if (!user) return 'privy_sync';
    if (user.google?.email) return 'google';
    if (user.email?.address) return 'email';
    const hasWallet = user.linkedAccounts?.some(
        (a: any) => a.type === 'wallet' && a.address
    );
    if (hasWallet) return 'wallet';
    return 'privy_sync';
}

export function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout, getAccessToken } = usePrivy();
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
                if (typeof data.clawCoinBalance === "number") store.setCoinBalance(data.clawCoinBalance);
                store.setIsAdmin(!!data.isAdmin);
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
            syncedWalletRef.current = walletAddress;

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
                    const authMethod = detectPrivyMethod(user);
                    if (data.isNew) {
                        trackSignUp({ method: authMethod, location: 'modal' });
                    } else if (data.userId) {
                        trackLogin({ method: authMethod });
                    }
                    if (data.userId) {
                        store.setUserId(data.userId);
                        // A1 – Set User ID for cross-session identity stitching
                        setGAUserId(data.userId);
                    }
                    if (typeof data.usdcBalance === "number") {
                        store.setBalance(data.usdcBalance);
                    }
                    if (typeof data.clawCoinBalance === "number") {
                        store.setCoinBalance(data.clawCoinBalance);
                    }
                    // Cookie is now set — re-fetch /api/auth/me to pick up isAdmin and full profile
                    syncAuth();
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
        isAuthenticated: authenticated || !!store.userId,
        user,
        userId: store.userId,
        walletAddress: store.walletAddress,
        displayName: store.displayName,
        // Check admin from store (cookie-based) OR directly from Privy user email (instant, no cookie needed)
        isAdmin: store.isAdmin || (() => {
            const privyEmail = user?.email?.address?.toLowerCase() || "";
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
                .split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
            return !!privyEmail && adminEmails.includes(privyEmail);
        })(),
        login: handleLogin,
        logout: handleLogout,
        syncAuth,
        getAccessToken,
        localAuthChecked
    };
}

