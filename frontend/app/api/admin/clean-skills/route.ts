import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== "clawadmin123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keepUser = "did:privy:cmmkslvg700fh0cl4vz4ax4ue";

    // Delete all skills not created by this user
    const deleteResult = await prisma.skill.deleteMany({
      where: {
        creatorUserId: { not: keepUser }
      }
    });

    const deleteNullResult = await prisma.skill.deleteMany({
      where: {
        creatorUserId: null
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `Successfully deleted old skills.`,
      deletedCount: deleteResult.count + deleteNullResult.count
    });

  } catch (error: any) {
    console.error("Cleanup API Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete skills", 
      details: error.message 
    }, { status: 500 });
  }
}
