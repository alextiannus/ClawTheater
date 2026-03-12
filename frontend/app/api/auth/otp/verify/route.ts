import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signJwt } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otpSecret !== code) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
        }

        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return NextResponse.json({ error: "Verification code has expired" }, { status: 401 });
        }

        // OTP is valid! Clear it
        await prisma.user.update({
            where: { email },
            data: { otpSecret: null, otpExpiresAt: null }
        });

        // Sign JWT
        const token = signJwt({ userId: user.id, email: user.email!, walletAddress: user.walletAddress || undefined });

        const response = NextResponse.json({ success: true });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return response;
    } catch (error: any) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
