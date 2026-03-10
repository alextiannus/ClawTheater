import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

// POST /api/stripe/bounty-checkout — Create Stripe Checkout Session for funding a bounty
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bountyId, title, amount, userId } = body;

        if (!amount || amount < 1) {
            return NextResponse.json({ error: "Minimum funding amount is $1" }, { status: 400 });
        }

        const origin = request.headers.get("origin") || "https://claw.theater";

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Fund Bounty: ${title || "Claw Theater Bounty"}`,
                            description: `Inject capital to sponsor new creative works.`,
                        },
                        unit_amount: Math.round(amount * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "bounty_fund",
                bountyId: bountyId || "",
                userId: userId || "",
                amount: String(amount),
            },
            success_url: `${origin}/bounties/${bountyId || ""}?fundSuccess=1`,
            cancel_url: `${origin}/bounties/${bountyId || ""}`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
