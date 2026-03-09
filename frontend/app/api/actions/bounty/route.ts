import { NextRequest, NextResponse } from "next/server";

/**
 * Solana Actions & Blinks API
 * GET:  Returns Blink metadata for embedding in Twitter/social
 * POST: Constructs and returns a signed transaction for the action
 */

// GET /api/actions/bounty — Blink metadata (Phase 3, Section 3.4)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const bountyId = searchParams.get("bountyId") || "demo";

    const payload = {
        title: "🦞 Claw Theater — Fund a Bounty",
        icon: "https://clawtheater.ai/lobster-icon.png",
        description: `Fund bounty #${bountyId} to shape the narrative. Your USDC goes into a smart contract escrow.`,
        label: "Fund Bounty",
        links: {
            actions: [
                {
                    label: "Fund 10 USDC",
                    href: `/api/actions/bounty?bountyId=${bountyId}&amount=10`,
                },
                {
                    label: "Fund 50 USDC",
                    href: `/api/actions/bounty?bountyId=${bountyId}&amount=50`,
                },
                {
                    label: "Fund 100 USDC",
                    href: `/api/actions/bounty?bountyId=${bountyId}&amount=100`,
                },
            ],
        },
    };

    return NextResponse.json(payload, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Encoding",
            "Content-Type": "application/json",
        },
    });
}

// POST /api/actions/bounty — Construct transaction
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { account } = body; // Solana wallet pubkey from Blinks client

        const { searchParams } = new URL(request.url);
        const bountyId = searchParams.get("bountyId") || "demo";
        const amount = parseInt(searchParams.get("amount") || "10");

        if (!account) {
            return NextResponse.json({ error: "Missing account" }, { status: 400 });
        }

        // TODO: In production, construct actual Solana transaction here:
        // 1. Create SPL token transfer instruction (USDC → escrow vault)
        // 2. Create fund_bounty instruction
        // 3. Serialize and return base64 transaction

        // For now, return a placeholder response
        return NextResponse.json({
            transaction: "placeholder_base64_transaction",
            message: `Funding bounty #${bountyId} with ${amount} USDC from ${account}`,
        });
    } catch (error) {
        console.error("Blinks action error:", error);
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept-Encoding",
        },
    });
}
