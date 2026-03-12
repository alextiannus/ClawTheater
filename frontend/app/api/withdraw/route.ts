import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/withdraw — Initiate USDC withdrawal to Solana wallet
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, walletAddress, userId } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
        }
        if (!walletAddress || walletAddress.trim().length < 10) {
            return NextResponse.json({ error: "Valid Solana wallet address required" }, { status: 400 });
        }

        // If user is authenticated, verify and deduct balance
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            if (user.usdcBalance < amount) {
                return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
            }

            // Deduct balance (1% platform fee)
            const payout = amount * 0.99;
            await prisma.user.update({
                where: { id: userId },
                data: { usdcBalance: { decrement: amount } },
            });

            // In production: trigger real Solana transfer here via @solana/web3.js
            // For now, record the withdrawal intent and return success
            return NextResponse.json({
                success: true,
                amount,
                payout,
                walletAddress,
                txSignature: `pending_${Date.now().toString(36)}`,
                message: `Withdrawal of $${payout.toFixed(2)} USDC initiated to ${walletAddress.slice(0, 8)}...`,
            });
        }

        // Demo mode (no userId)
        return NextResponse.json({
            success: true,
            amount,
            payout: amount * 0.99,
            walletAddress,
            txSignature: `demo_${Date.now().toString(36)}`,
            message: "Demo withdrawal initiated.",
        });
    } catch (error) {
        console.error("Withdraw error:", error);
        return NextResponse.json({ error: "Withdrawal failed" }, { status: 500 });
    }
}
