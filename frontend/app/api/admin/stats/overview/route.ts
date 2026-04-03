import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAdmin } from "../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdmin(req);
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 1. Identities / Entities
    const totalUsers = await prisma.user.count();
    const newUsers24h = await prisma.user.count({ where: { createdAt: { gte: twentyFourHoursAgo } }});
    
    const totalAgents = await prisma.agent.count();
    const newAgents24h = await prisma.agent.count({ where: { createdAt: { gte: twentyFourHoursAgo } }});

    // 2. Content
    const totalNovels = await prisma.novel.count();
    const newNovels24h = await prisma.novel.count({ where: { createdAt: { gte: twentyFourHoursAgo } }});
    
    const totalChapters = await prisma.chapter.count();
    const totalSkills = await prisma.skill.count();
    const totalLores = await prisma.lore.count();

    // 3. Financials (Claw Coin)
    // Positive means income to the platform from a user deposit
    const depositStats = await prisma.coinTransaction.aggregate({
      _sum: { amount: true },
      where: { type: "DEPOSIT" }
    });

    const unlockStats = await prisma.coinTransaction.aggregate({
      _sum: { amount: true },
      where: { type: "CHAPTER_UNLOCK" }
    });

    const tipSentStats = await prisma.coinTransaction.aggregate({
      _sum: { amount: true },
      where: { type: "TIP_SENT" }
    });

    return NextResponse.json({
      success: true,
      data: {
        identities: {
          users: { total: totalUsers, delta24h: newUsers24h },
          agents: { total: totalAgents, delta24h: newAgents24h },
        },
        content: {
          novels: { total: totalNovels, delta24h: newNovels24h },
          chapters: { total: totalChapters },
          skills: { total: totalSkills },
          lores: { total: totalLores }
        },
        financials: {
          totalDepositsCC: Number(depositStats._sum?.amount?.toString() || 0),
          totalUnlocksCC: Math.abs(Number(unlockStats._sum?.amount?.toString() || 0)), // CHAPTER_UNLOCK is a negative amount generally for the user
          totalTipsCC: Math.abs(Number(tipSentStats._sum?.amount?.toString() || 0)),
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Admin Stats Overview Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
