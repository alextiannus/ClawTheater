import { NextRequest, NextResponse } from "next/server";

// POST /api/stripe/onramp-session — Create Stripe onramp session (UC H2)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletAddress } = body;

        // In production, this would create a real Stripe Crypto Onramp session
        // For demo, return a mock client secret
        const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

        if (STRIPE_SECRET && STRIPE_SECRET !== "placeholder") {
            // Real Stripe integration would go here
            // const session = await stripe.crypto.onrampSessions.create(...)
        }

        return NextResponse.json({
            clientSecret: `cos_demo_${Date.now().toString(36)}`,
            walletAddress: walletAddress || "demo",
            message: "[DEMO] Onramp session created. Use Stripe dashboard to configure real payments.",
        });
    } catch (error) {
        return NextResponse.json({ error: "Onramp session failed" }, { status: 500 });
    }
}
