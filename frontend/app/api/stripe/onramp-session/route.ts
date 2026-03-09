import { NextResponse } from "next/server";

// POST /api/stripe/onramp-session — Create a Stripe Crypto Onramp session
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { walletAddress } = body;

        // Use raw Stripe API (crypto onramp types may not be in SDK yet)
        const params = new URLSearchParams();
        params.append("destination_networks[]", "solana");
        params.append("destination_currencies[]", "usdc");
        if (walletAddress) {
            params.append("wallet_addresses[solana]", walletAddress);
        }

        const response = await fetch("https://api.stripe.com/v1/crypto/onramp_sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });

        const session = await response.json();

        if (session.error) {
            return NextResponse.json(
                { error: session.error.message },
                { status: session.error.status || 400 }
            );
        }

        return NextResponse.json({
            clientSecret: session.client_secret,
        });
    } catch (error: any) {
        console.error("Stripe onramp session error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to create onramp session" },
            { status: 500 }
        );
    }
}
