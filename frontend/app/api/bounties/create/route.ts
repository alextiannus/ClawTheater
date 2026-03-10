import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/bounties/create — Create a new bounty
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, category, tags, language, minimumAmount } = body;

        if (!title || !category || !language) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const bounty = await prisma.bounty.create({
            data: {
                title,
                description: description || "",
                prompt: `[${category}] ${description || ""}`,
                tags: JSON.stringify(tags || []),
                language: language || "en",
                consensusThreshold: 60,
                status: "FUNDING",
            },
        });

        return NextResponse.json({
            bountyId: bounty.id,
            minimumAmount: minimumAmount || 100,
            success: true,
        });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
