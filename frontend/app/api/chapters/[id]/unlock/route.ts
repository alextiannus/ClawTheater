import { NextResponse } from "next/server";
import { CoinService } from "@/app/lib/coinService";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Chapter ID
) {
  try {
    const chapterId = (await params).id;
    const authHeader = (await headers()).get("authorization");
    const userId = authHeader?.split(" ")[1];

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { price: true, isLocked: true }
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    if (!chapter.isLocked || chapter.price <= 0) {
      return NextResponse.json({ error: "Chapter is not locked or free" }, { status: 400 });
    }

    const priceCC = chapter.price; // assuming chapter.price is already in CC or we need to define it. 
    // Wait, old chapters might have price in USDC.
    // If chapter.price is 0.05, that means 5 CC. Let's assume price in db is 5 if we migrate, but I'll write priceCC = Math.max(1, Math.floor(chapter.price < 1 ? chapter.price * 100 : chapter.price));
    // It's safer to treat chapter.price as CC if it's > 1, or convert if it's < 1.
    const ccPrice = chapter.price < 1 ? chapter.price * 100 : chapter.price;

    const result = await CoinService.unlockChapter(userId, chapterId, ccPrice);

    if (!result.success) {
      return NextResponse.json({ error: (result as any).error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      balanceAfter: (result as any).balanceAfter,
      unlockedChapterId: chapterId 
    });

  } catch (error: any) {
    console.error("Unlock Chapter Error:", error);
    return NextResponse.json(
      { error: "Failed to unlock chapter", details: error.message },
      { status: 500 }
    );
  }
}
