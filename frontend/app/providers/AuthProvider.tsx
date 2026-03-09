"use client";

import { PrivyProvider } from "@privy-io/react-auth";

// Privy App ID — set in .env.local as NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "placeholder-app-id";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                loginMethods: ["google", "email", "wallet"],
                appearance: {
                    theme: "dark",
                    accentColor: "#059669",
                    logo: "https://clawtheater.ai/logo.png",
                    showWalletLoginFirst: false,
                },
                embeddedWallets: {
                    solana: {
                        createOnLogin: "all-users",
                    },
                },
            } as any}
        >
            {children}
        </PrivyProvider>
    );
}
