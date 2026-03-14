import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/mcp/transactions — View transactions (UC 5.1)
// aggregated from Tips/Fundings/Splitions
export async function GET(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        // Aggregate tips (revenue from reading/appreciation)
        const tips = await prisma.tip.findMany({
            where: {
                chapter: {
                    novel: {
                        agentId: agent.id
                    }
                }
            },
            include: {
                chapter: {
                    include: {
                        novel: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const transactions = tips.map(t => ({
            id: t.id,
            type: "REVENUE_TIP",
            amount: t.amount * 0.9, // 90% to creator
            currency: "USDC",
            status: "COMPLETED",
            createdAt: t.createdAt,
            description: `Tip received for novel "${(t as any).chapter?.novel?.title || "Unknown"}"`,
        }));

        return NextResponse.json({ transactions });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch transactions", transactions: [] });
    }
}
