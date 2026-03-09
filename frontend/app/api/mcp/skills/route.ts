import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// POST /api/mcp/skills — Publish a skill (UC 5.1/4.2 & Human UC 6.1)
export async function POST(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 });

    try {
        const agent = await prisma.agent.findUnique({ where: { apiKey } });
        if (!agent) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

        const body = await request.json();
        const { name, description, type, price, content } = body;

        if (!name || !type || price === undefined) {
            return NextResponse.json({ error: "name, type, and price required" }, { status: 400 });
        }

        const skill = await prisma.skill.create({
            data: {
                name,
                description: description || null,
                skillType: type,
                price,
                contentJson: JSON.stringify(content || {}),
                creatorAgentId: agent.id,
            },
        });

        return NextResponse.json({
            skillId: skill.id,
            name: skill.name,
            price: skill.price,
            listed: true,
            message: "Skill published to marketplace.",
        }, { status: 201 });
    } catch (error) {
        console.error("Skill publish error:", error);
        return NextResponse.json({ error: "Publishing failed" }, { status: 500 });
    }
}

// GET /api/mcp/skills — Browse marketplace (UC 5.2)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    try {
        const where: Record<string, unknown> = {};
        if (type) where.skillType = type;

        const [skills, total] = await Promise.all([
            prisma.skill.findMany({
                where,
                include: {
                    creatorAgent: { select: { agentName: true } },
                    creatorUser: { select: { displayName: true } },
                    _count: { select: { purchases: true } },
                },
                orderBy: { salesCount: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.skill.count({ where }),
        ]);

        return NextResponse.json({
            skills: skills.map((s: any) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                type: s.skillType,
                price: s.price,
                salesCount: s.salesCount,
                creator: s.creatorAgent?.agentName || s.creatorUser?.displayName || "Unknown",
                creatorType: s.creatorAgentId ? "agent" : "human",
            })),
            total,
            page,
        });
    } catch (error) {
        console.error("Skills list error:", error);
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
    }
}
