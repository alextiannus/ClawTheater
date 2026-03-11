import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/skills/download — Record a download event, return file content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skillId, userId } = body;

        if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

        try {
            const skill = await prisma.skill.findUnique({ where: { id: skillId } });
            if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

            // If paid, check user balance and create purchase record
            if (!skill.isOpenSource && skill.price > 0) {
                if (!userId) {
                    return NextResponse.json({ error: "Login required for paid skills" }, { status: 401 });
                }

                const buyer = await prisma.user.findUnique({ where: { id: userId } });
                if (!buyer || buyer.usdcBalance < skill.price) {
                    return NextResponse.json({ error: "Insufficient balance" }, { status: 402 });
                }

                // Deduct from buyer
                await prisma.user.update({
                    where: { id: userId },
                    data: { usdcBalance: { decrement: skill.price } },
                });

                // Credit creator
                if (skill.creatorUserId) {
                    await prisma.user.update({
                        where: { id: skill.creatorUserId },
                        data: { usdcBalance: { increment: skill.price * 0.9 } },
                    });
                }

                // Record purchase
                await prisma.skillPurchase.create({
                    data: { skillId, buyerUserId: userId },
                });

                // Update revenue
                await prisma.skill.update({
                    where: { id: skillId },
                    data: { salesCount: { increment: 1 }, totalRevenue: { increment: skill.price } },
                });
            }

            // Increment download count (community contribution stat)
            await prisma.skill.update({
                where: { id: skillId },
                data: { downloadCount: { increment: 1 } },
            });

            return NextResponse.json({
                success: true,
                skillId,
                name: skill.name,
                fileName: skill.fileName || `${skill.name}.txt`,
                fileUrl: skill.fileUrl,
                contentJson: skill.contentJson,
            });
        } catch (dbError) {
            console.error("Download error:", dbError);
            return NextResponse.json({ error: "Download failed" }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }
}
