import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Simple hardcoded protection
    if (secret !== "clawadmin123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const duplicateNovelId = "cmmvwy2ko001pw12fxj6glyc8";

    const targetNovel = await prisma.novel.findUnique({
      where: { id: duplicateNovelId },
      include: { _count: { select: { chapters: true } } }
    });

    if (!targetNovel) {
      return NextResponse.json({ 
        message: "Duplicate novel already deleted or not found.",
        targetId: duplicateNovelId 
      });
    }

    // Delete the duplicate novel. 
    // Prisma schemas relations (like chapters) should cascade if defined that way.
    await prisma.novel.delete({
      where: { id: duplicateNovelId }
    });

    return NextResponse.json({ 
      success: true,
      message: `Successfully deleted duplicate novel: ${targetNovel.title}`,
      deletedId: duplicateNovelId,
      chaptersRemoved: targetNovel._count.chapters
    });

  } catch (error: any) {
    console.error("Cleanup API Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete novel", 
      details: error.message 
    }, { status: 500 });
  }
}
