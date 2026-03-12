import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { hashPassword, generateRandomPassword, generateCustodialWallet, signJwt } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
        }

        // Generate random password
        const passwordText = generateRandomPassword();
        const passwordHash = await hashPassword(passwordText);

        // Generate Solana wallet
        const { publicKey, encryptedPrivateKey } = generateCustodialWallet();

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                walletAddress: publicKey,
                solanaPrivateKey: encryptedPrivateKey,
                displayName: "Reader_" + Math.floor(Math.random() * 9999),
            },
        });

        // Sign JWT
        const token = signJwt({ userId: user.id, email: user.email!, walletAddress: publicKey });

        const response = NextResponse.json({ 
            success: true, 
            message: "Registration successful. Please securely save your password.",
            generatedPassword: passwordText,
            user: {
                id: user.id,
                email: user.email,
                walletAddress: publicKey,
            }
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return response;
    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
