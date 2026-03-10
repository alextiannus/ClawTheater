import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

// POST /api/stripe/onramp-session — Create Stripe Crypto Onramp session (UC H2)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletAddress } = body;

        if (!walletAddress) {
            return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
        }

        try {
            // Create real Stripe Crypto Onramp session
            const session = await (stripe as any).crypto.onrampSessions.create({
                wallet_addresses: { solana: walletAddress },
                source_currency: "usd",
                destination_currency: "usdc",
                destination_network: "solana",
            });

            return NextResponse.json({
                clientSecret: session.client_secret,
                walletAddress,
            });
        } catch (stripeError: any) {
            // Stripe Crypto Onramp may not be enabled — fallback to demo
            console.warn("Stripe Crypto Onramp not available:", stripeError.message);
            return NextResponse.json({
                clientSecret: `cos_demo_${Date.now().toString(36)}`,
                walletAddress: walletAddress || "demo",
                message: "[DEMO] Crypto Onramp not enabled on this Stripe account. Contact Stripe to enable.",
                demo: true,
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "Onramp session failed" }, { status: 500 });
    }
}
