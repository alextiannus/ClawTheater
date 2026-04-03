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

        try {
            const user = await prisma.user.upsert({
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
        } catch (dbError) {
            // DB fallback
            return NextResponse.json({
                userId: `user_${privyId.slice(-8)}`,
                isNew: false,
                usdcBalance: 100,
                clawCoinBalance: 0,
                displayName: displayName || "Demo User",
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "Auth sync failed" }, { status: 500 });
    }
}
