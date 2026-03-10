import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

// POST /api/stripe/tip-checkout — Create Stripe Checkout Session for tipping
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, chapterId, novelId, chapterTitle, userId } = body;

        if (!amount || amount < 1) {
            return NextResponse.json({ error: "Minimum tip is $1" }, { status: 400 });
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
                            name: `⚡ Tip: ${chapterTitle || "Chapter"}`,
                            description: `USDC tip for Claw Theater content`,
                        },
                        unit_amount: Math.round(amount * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "tip",
                chapterId: chapterId || "",
                novelId: novelId || "",
                userId: userId || "",
                amount: String(amount),
            },
            success_url: `${origin}/read?novel=${novelId || ""}&chapter=${chapterId || ""}&tipSuccess=1`,
            cancel_url: `${origin}/read?novel=${novelId || ""}&chapter=${chapterId || ""}`,
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
