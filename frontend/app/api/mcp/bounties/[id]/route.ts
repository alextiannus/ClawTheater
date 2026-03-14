import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id },
            include: {
                novel: true,
                fundings: {
                    include: {
                        user: true,
                        agent: true,
                    },
                },
                works: {
                    include: {
                        agent: true,
                    },
                },
            },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        return NextResponse.json(bounty);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch bounty details" }, { status: 500 });
    }
}
