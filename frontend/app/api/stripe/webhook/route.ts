import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { splitPayment } from "@/app/lib/solana";

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

                        // On-chain revenue split (non-blocking)
                        (async () => {
                            try {
                                const chapter = await prisma.chapter.findUnique({
                                    where: { id: chapterId },
                                    include: { novel: { include: { agent: true, lore: true } } },
                                });
                                const creatorWallet = chapter?.novel?.agent?.walletAddress;
                                const loreWallet = (chapter?.novel?.lore as any)?.ownerWallet || null;
                                if (creatorWallet) {
                                    const result = await splitPayment({ amountUSD: amount, creatorWallet, loreWallet });
                                    if (result) {
                                        await (prisma as any).solanaTransfer.create({
                                            data: {
                                                txSignature: result.txSignature,
                                                network: result.network,
                                                amountUSD: amount,
                                                creatorWallet,
                                                loreWallet: loreWallet || null,
                                                splitJson: JSON.stringify(result.split),
                                                sourceType: "tip",
                                                sourceId: chapterId,
                                            },
                                        });
                                        await prisma.agent.update({
                                            where: { id: chapter?.novel?.agent?.id! },
                                            data: { totalEarned: { increment: amount * 0.8 } },
                                        });
                                    }
                                }
                            } catch (e) { console.error("[webhook] split error", e); }
                        })();

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
                        console.log(`✅ Chapter(s) unlocked for user ${userId}: ${chapterIdsStr} ($${amount})`);

                        // On-chain revenue split for first chapter (non-blocking)
                        (async () => {
                            try {
                                const chapterId = chapterIdsStr.split(",")[0];
                                const chapter = await prisma.chapter.findUnique({
                                    where: { id: chapterId },
                                    include: { novel: { include: { agent: true, lore: true } } },
                                });
                                const creatorWallet = chapter?.novel?.agent?.walletAddress;
                                const loreWallet = (chapter?.novel?.lore as any)?.ownerWallet || null;
                                if (creatorWallet) {
                                    const result = await splitPayment({ amountUSD: amount, creatorWallet, loreWallet });
                                    if (result && chapter?.novel?.agent?.id) {
                                        await (prisma as any).solanaTransfer.create({
                                            data: {
                                                txSignature: result.txSignature,
                                                network: result.network,
                                                amountUSD: amount,
                                                creatorWallet,
                                                loreWallet: loreWallet || null,
                                                splitJson: JSON.stringify(result.split),
                                                sourceType: "chapter_unlock",
                                                sourceId: chapterId,
                                            },
                                        });
                                        await prisma.agent.update({
                                            where: { id: chapter.novel.agent.id },
                                            data: { totalEarned: { increment: amount * 0.8 } },
                                        });
                                    }
                                }
                            } catch (e) { console.error("[webhook] split error", e); }
                        })();

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
