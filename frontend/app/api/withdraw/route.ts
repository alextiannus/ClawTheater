import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/withdraw — Initiate USDC withdrawal to Solana wallet
// Supports both human users (userId body param) and AI agents (x-api-key header)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, walletAddress, userId } = body;
        const apiKey = request.headers.get("x-api-key");

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid withdrawal amount. Must be > 0 USDC." }, { status: 400 });
        }

        // ── Agent withdrawal path ────────────────────────────────────────
        if (apiKey) {
            const agent = await prisma.agent.findUnique({ where: { apiKey } });
            if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

            const destWallet = walletAddress || agent.walletAddress;
            if (!destWallet || destWallet.trim().length < 32) {
                return NextResponse.json({
                    error: "Solana wallet address required. Provide walletAddress in body or bind one first: PUT /api/mcp/agents with { walletAddress: '...' }",
                }, { status: 400 });
            }

            if (agent.totalEarned < amount) {
                return NextResponse.json({
                    error: `Insufficient balance. Available: $${agent.totalEarned.toFixed(2)} USDC`,
                }, { status: 400 });
            }

            const payout = amount * 0.99;
            await prisma.agent.update({
                where: { id: agent.id },
                data: { totalEarned: { decrement: amount } },
            });

            // TODO: In production — trigger real SPL Token transfer via @solana/web3.js or Privy server wallet
            // await sendSplToken({ from: PLATFORM_WALLET, to: destWallet, amountUsdc: payout });

            return NextResponse.json({
                success: true,
                amount,
                payout,
                fee: amount * 0.01,
                walletAddress: destWallet,
                txSignature: `pending_${Date.now().toString(36)}`,
                remainingBalance: agent.totalEarned - amount,
                message: `Withdrawal of $${payout.toFixed(2)} USDC initiated to ${destWallet.slice(0, 8)}...${destWallet.slice(-4)}. Will arrive within 30s once on-chain settlement is live.`,
            });
        }

        // ── Human user withdrawal path ───────────────────────────────────
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

            const destWallet = walletAddress || user.walletAddress;
            if (!destWallet || destWallet.trim().length < 32) {
                return NextResponse.json({
                    error: "Valid Solana wallet address required. Provide walletAddress in body or go to Dashboard → Settings to bind one.",
                }, { status: 400 });
            }

            if (user.usdcBalance < amount) {
                return NextResponse.json({
                    error: `Insufficient balance. Available: $${user.usdcBalance.toFixed(2)} USDC`,
                }, { status: 400 });
            }

            const payout = amount * 0.99;
            await prisma.user.update({
                where: { id: userId },
                data: { usdcBalance: { decrement: amount } },
            });

            // TODO: trigger real Solana transfer here via @solana/web3.js
            return NextResponse.json({
                success: true,
                amount,
                payout,
                fee: amount * 0.01,
                walletAddress: destWallet,
                txSignature: `pending_${Date.now().toString(36)}`,
                message: `Withdrawal of $${payout.toFixed(2)} USDC initiated to ${destWallet.slice(0, 8)}...`,
            });
        }

        return NextResponse.json({
            error: "Authentication required. Provide userId in body (human) or x-api-key header (agent).",
        }, { status: 401 });

    } catch (error) {
        console.error("[withdraw] Error:", error);
        return NextResponse.json({ error: "Withdrawal failed" }, { status: 500 });
    }
}
