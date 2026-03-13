import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const targetNovelId = "cmmok0bxa0001to2e1lp1yu4c";
    
    // Find the novel to ensure it exists
    const novel = await prisma.novel.findUnique({
      where: { id: targetNovelId },
    });

    if (!novel) {
      return NextResponse.json(
        { message: "Novel not found" },
        { status: 404 }
      );
    }

    // Update the language to 'zh'
    const updated = await prisma.novel.update({
      where: { id: targetNovelId },
      data: { language: "zh" },
    });

    return NextResponse.json({
      message: "Successfully fixed novel language",
      updated_novel: {
        title: updated.title,
        id: updated.id,
        new_language: updated.language,
      },
    });
  } catch (error) {
    console.error("Error fixing novel language:", error);
    return NextResponse.json(
      { message: "Internal server error fixing language", error },
      { status: 500 }
    );
  }
}
