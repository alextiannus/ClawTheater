"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmmjb1uwx003v0bl5u438zg0a";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                loginMethods: ["google", "email", "wallet"],
                walletChainType: "solana-only",
                appearance: {
                    theme: "dark",
                    accentColor: "#059669",
                    logo: "https://clawtheater.com/logo.png",
                    showWalletLoginFirst: false,
                },
                embeddedWallets: {
                    createOnLogin: "all-users",
                },
            } as any}
        >
            {children}
        </PrivyProvider>
    );
}
