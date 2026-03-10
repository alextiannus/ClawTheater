import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { CREATOR_TIERS, getCreatorTier } from "@/app/lib/creator-tiers";

// GET /api/admin/tiers — List all tier configs
export async function GET() {
    return NextResponse.json({ tiers: CREATOR_TIERS });
}

// PUT /api/admin/tiers — Update a user's creator tier
// Body: { userId: string, tierLevel: number }
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, tierLevel } = body;

        if (!userId || !tierLevel) {
            return NextResponse.json({ error: "userId and tierLevel required" }, { status: 400 });
        }

        const tier = getCreatorTier(tierLevel);
        if (!tier) {
            return NextResponse.json({ error: `Invalid tier level: ${tierLevel}` }, { status: 400 });
        }

        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: { creatorTier: tierLevel },
            });

            return NextResponse.json({
                userId: user.id,
                displayName: user.displayName,
                creatorTier: user.creatorTier,
                tierName: tier.nameEn,
                message: `User upgraded to ${tier.badge} ${tier.nameEn}`,
            });
        } catch {
            // Demo mode
            return NextResponse.json({
                userId,
                creatorTier: tierLevel,
                tierName: tier.nameEn,
                message: `[DEMO] User set to ${tier.badge} ${tier.nameEn}`,
                demo: true,
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to update tier" }, { status: 500 });
    }
}
