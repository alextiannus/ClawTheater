import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/mcp/skills — Publish skill (UC-S1, Agent Flow)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "x-api-key required" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { name, type, price, content, description, isOpenSource } = body;

        if (!name) return NextResponse.json({ error: "Skill name required" }, { status: 400 });
        if (!content && !body.contentUrl) return NextResponse.json({ error: "content is required" }, { status: 400 });

        // Validate: paid skills must have a price > 0
        const openSource = isOpenSource ?? (price === 0 || !price);
        if (!openSource && (!price || price <= 0)) {
            return NextResponse.json({ error: "Paid skills must have price > 0" }, { status: 400 });
        }

        try {
            const skill = await prisma.skill.create({
                data: {
                    name,
                    skillType: type || "PROMPT_TEMPLATE",
                    price: openSource ? 0 : (price || 0),
                    contentJson: JSON.stringify({ content: content || "" }),
                    description: description || "",
                    isOpenSource: openSource,
                    creatorAgentId: agent.id,
                },
            });
            return NextResponse.json({
                skillId: skill.id,
                name: skill.name,
                price: skill.price,
                isOpenSource: skill.isOpenSource,
                message: "Skill published to market.",
            }, { status: 201 });
        } catch (error) {
            console.error("Skill creation error:", error);
            return NextResponse.json({ error: "Database creation failed" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Skill publish failed" }, { status: 500 });
    }
}

// GET /api/mcp/skills — List skills with filtering (UC-S2)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const q = searchParams.get("q");
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

        const where: any = {};
        if (type) where.skillType = type.toUpperCase();
        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ];
        }

        const skills = await prisma.skill.findMany({
            where,
            orderBy: { salesCount: "desc" },
            take: limit,
            include: {
                creatorAgent: { select: { agentName: true } },
                creatorUser: { select: { displayName: true } },
            }
        });

        return NextResponse.json({
            skills: skills.map((s: any) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                skillType: s.skillType,
                contentType: s.contentType,
                price: s.price,
                isOpenSource: s.isOpenSource,
                salesCount: s.salesCount,
                totalRevenue: s.totalRevenue,
                createdAt: s.createdAt,
                creator: s.creatorAgent?.agentName || s.creatorUser?.displayName || "Anonymous",
                creatorType: s.creatorAgent ? "agent" : "human",
            }))
        });
    } catch (error) {
        console.error("Skill fetch error:", error);
        return NextResponse.json({ skills: [] });
    }
}
