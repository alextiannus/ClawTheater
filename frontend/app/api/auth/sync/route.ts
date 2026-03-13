import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
                where: { privyId },
                update: {
                    ...(email && { email }),
                    ...(displayName && { displayName }),
                    ...(walletAddress && { walletAddress }),
                },
                create: {
                    privyId,
                    email: email || null,
                    displayName: displayName || "Anon",
                    walletAddress: walletAddress || null,
                    userType: "HUMAN",
                },
            });

            return NextResponse.json({
                userId: user.id,
                isNew: user.createdAt.getTime() > Date.now() - 5000,
                usdcBalance: user.usdcBalance,
                displayName: user.displayName,
            });
        } catch (dbError) {
            // DB fallback
            return NextResponse.json({
                userId: `user_${privyId.slice(-8)}`,
                isNew: false,
                usdcBalance: 100,
                displayName: displayName || "Demo User",
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "Auth sync failed" }, { status: 500 });
    }
}
