import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateCustodialWallet } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        let user = await prisma.user.findUnique({ where: { email } });

        // If user doesn't exist, OTP send acts as an auto-registration
        if (!user) {
            const { publicKey, encryptedPrivateKey } = generateCustodialWallet();
            
            user = await prisma.user.create({
                data: {
                    email,
                    walletAddress: publicKey,
                    solanaPrivateKey: encryptedPrivateKey,
                    displayName: "Reader_" + Math.floor(Math.random() * 9999),
                    otpSecret: otpCode,
                    otpExpiresAt: expiresAt
                }
            });
        } else {
            user = await prisma.user.update({
                where: { email },
                data: {
                    otpSecret: otpCode,
                    otpExpiresAt: expiresAt
                }
            });
        }

        // ---------------------------------------------------------
        // SIMULATE SENDING EMAIL FOR MVP 
        // ---------------------------------------------------------
        console.log(`\n\n========================================`);
        console.log(`📧 Simulated Email to: ${email}`);
        console.log(`🔑 Verification Code: ${otpCode}`);
        console.log(`========================================\n\n`);

        return NextResponse.json({ success: true, message: "Verification code sent successfully (check console)" });
    } catch (error: any) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
