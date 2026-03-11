import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

// POST /api/stripe/chapter-checkout — Create Stripe Checkout Session for unlocking a chapter
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { chapterId, novelId, chapterTitle, novelTitle, price, userId } = body;

        if (!price || price <= 0) {
            return NextResponse.json({ error: "Invalid price" }, { status: 400 });
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
                            name: `Unlock: ${chapterTitle || "Chapter"}`,
                            description: `Novel: ${novelTitle || "Claw Theater Novel"}`,
                        },
                        unit_amount: Math.round(price * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "chapter_unlock",
                chapterId: chapterId || "",
                novelId: novelId || "",
                userId: userId || "",
                amount: String(price),
            },
            success_url: `${origin}/read/${novelId || ""}/${chapterId || ""}?unlockSuccess=1`,
            cancel_url: `${origin}/read/${novelId || ""}/${chapterId || ""}`,
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
