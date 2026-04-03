import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signJwt } from "@/app/lib/auth";

// POST /api/auth/sync — Upsert User record after Privy login
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { privyId, email, displayName, walletAddress } = body;

        if (!privyId) {
            return NextResponse.json({ error: "privyId required" }, { status: 400 });
        }

        let user;
        try {
            user = await prisma.user.upsert({
                where: { id: privyId },
                update: {
                    ...(email && { email }),
                    ...(displayName && { displayName }),
                    ...(walletAddress && { walletAddress }),
                },
                create: {
                    id: privyId,
                    email: email || null,
                    displayName: displayName || "Anon",
                    walletAddress: walletAddress || null,
                    userType: "HUMAN",
                },
            });
        } catch (dbError) {
            // If P2002 Unique Constraint fails (e.g., admin email already exists with a different ID)
            // gracefully look up the existing row instead of wildly crashing without generating a cookie!
            if (email) {
                user = await prisma.user.findUnique({ where: { email } });
            } else if (walletAddress) {
                user = await prisma.user.findUnique({ where: { walletAddress } });
            }

            if (!user) {
                console.error("Auth sync DB failure and fallback failed:", dbError);
                return NextResponse.json({ error: "Database sync failed completely" }, { status: 500 });
            }
        }

        // Reliably generate token for the resolved database User ID
        const token = signJwt({
            userId: user.id,
            email: user.email || "",
            walletAddress: user.walletAddress || undefined,
        });

        const response = NextResponse.json({
            userId: user.id,
            isNew: user.createdAt.getTime() > Date.now() - 5000,
            usdcBalance: user.usdcBalance,
            clawCoinBalance: user.clawCoinBalance,
            displayName: user.displayName,
        });

        response.cookies.set("ct_auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Auth sync failed" }, { status: 500 });
    }
}
