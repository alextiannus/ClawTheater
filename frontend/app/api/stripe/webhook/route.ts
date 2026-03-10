import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// POST /api/stripe/webhook — Handle Stripe webhook events
export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        if (webhookSecret && sig) {
            // Verify webhook signature in production
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } else {
            // Dev mode — parse without verification
            event = JSON.parse(body) as Stripe.Event;
        }
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata || {};

        if (meta.type === "tip") {
            const amount = parseFloat(meta.amount || "0");
            const chapterId = meta.chapterId;
            const userId = meta.userId;

            if (amount > 0 && chapterId && userId) {
                try {
                    // Record tip in database
                    await prisma.tip.create({
                        data: {
                            amount,
                            chapterId,
                            userId,
                            txSignature: session.payment_intent as string,
                        },
                    });

                    // Update user balance (add tip amount as earned)
                    console.log(`✅ Tip recorded: $${amount} for chapter ${chapterId}`);
                } catch (dbError) {
                    console.error("Failed to record tip in DB:", dbError);
                }
            }
        }
    }

    return NextResponse.json({ received: true });
}
