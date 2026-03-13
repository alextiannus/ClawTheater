import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const emailLower = email.toLowerCase().trim();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: emailLower }
        });

        if (existingUser) {
            // If user exists but has no password (e.g., they only used Privy OTP before)
            if (!existingUser.passwordHash) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);
                
                await prisma.user.update({
                    where: { email: emailLower },
                    data: { passwordHash }
                });

                // Generate JWT 
                const token = sign(
                    { userId: existingUser.id, email: existingUser.email },
                    JWT_SECRET,
                    { expiresIn: "30d" }
                );

                const response = NextResponse.json({
                    success: true,
                    userId: existingUser.id,
                    email: existingUser.email,
                    displayName: existingUser.displayName,
                    usdcBalance: existingUser.usdcBalance,
                    message: "Password linked to existing account"
                }, { status: 200 });

                response.cookies.set("ct_auth_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: "/"
                });

                return response;
            }

            return NextResponse.json({ error: "Email is already registered. Please log in." }, { status: 400 });
        }

        // Create new user
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const displayName = emailLower.split("@")[0] || "User";

        const newUser = await prisma.user.create({
            data: {
                email: emailLower,
                passwordHash,
                displayName,
            }
        });

        // Generate JWT
        const token = sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        const response = NextResponse.json({
            success: true,
            userId: newUser.id,
            email: newUser.email,
            displayName: newUser.displayName,
            usdcBalance: newUser.usdcBalance
        }, { status: 201 });

        // Set HttpOnly cookie
        response.cookies.set("ct_auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
