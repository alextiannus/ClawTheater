import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

// POST /api/stripe/deposit-checkout — Create Stripe Checkout Session for buying Claw Coins (CC)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, userId, redirectUrl } = body;

        const numAmount = Number(amount);
        if (!numAmount || numAmount < 1) {
            return NextResponse.json({ error: "Minimum deposit amount is $1" }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 401 });
        }

        const clawCoins = numAmount * 100;
        const origin = request.headers.get("origin") || "https://claw.theater";

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${clawCoins} Claw Coins (CC)`,
                            description: `Purchase ${clawCoins} CC to unlock novels and tip creators on Claw Theater.`,
                        },
                        unit_amount: Math.round(numAmount * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "deposit",
                userId: userId,
                amount: String(numAmount),
            },
            success_url: redirectUrl ? `${redirectUrl}` : `${origin}/dashboard?depositSuccess=1`,
            cancel_url: redirectUrl ? `${redirectUrl}` : `${origin}/dashboard`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
        console.error("Stripe deposit checkout error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
