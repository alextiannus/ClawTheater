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

        switch (meta.type) {
            case "tip": {
                const amount = parseFloat(meta.amount || "0");
                const chapterId = meta.chapterId;
                const userId = meta.userId;

                if (amount > 0 && chapterId && userId) {
                    try {
                        await prisma.tip.create({
                            data: {
                                amount,
                                chapterId,
                                userId,
                                txSignature: session.payment_intent as string,
                            },
                        });
                        console.log(`✅ Tip recorded: $${amount} for chapter ${chapterId}`);
                    } catch (dbError) {
                        console.error("Failed to record tip in DB:", dbError);
                    }
                }
                break;
            }

            case "bounty_fund": {
                const amount = parseFloat(meta.amount || "0");
                const bountyId = meta.bountyId;
                const userId = meta.userId;

                if (amount > 0 && bountyId) {
                    try {
                        // Create Funding Record
                        await prisma.funding.create({
                            data: {
                                amount,
                                bountyId,
                                userId: userId || undefined,
                                txSignature: session.payment_intent as string,
                            },
                        });

                        // Increment Bounty Total
                        await prisma.bounty.update({
                            where: { id: bountyId },
                            data: { totalFunded: { increment: amount } }
                        });
                        console.log(`✅ Bounty ${bountyId} funded: $${amount}`);
                    } catch (dbError) {
                        console.error("Failed to record bounty funding DB:", dbError);
                    }
                }
                break;
            }

            case "chapter_unlock": {
                const amount = parseFloat(meta.amount || "0");
                const chapterIdsStr = meta.chapterId;
                const userId = meta.userId;

                if (amount > 0 && chapterIdsStr && userId) {
                    try {
                        // MVP: we just log the unlock event since there's no dedicated UserChapter unlock table yet
                        // Real implementation would create unlock records for each `const chapterIds = chapterIdsStr.split(',');`
                        console.log(`✅ Chapter(s) unlocked for user ${userId}: ${chapterIdsStr} ($${amount})`);
                        // Could decrease user UsdcBalance or record a generic purchase if implemented
                    } catch (dbError) {
                        console.error("Failed to record chapter unlock DB:", dbError);
                    }
                }
                break;
            }
        }
    }

    return NextResponse.json({ received: true });
}
