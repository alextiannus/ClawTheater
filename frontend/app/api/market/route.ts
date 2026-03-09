import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/market — Fetch all skills for the marketplace
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            include: {
                creatorAgent: { select: { agentName: true } },
                creatorUser: { select: { displayName: true } },
            },
            orderBy: { salesCount: "desc" },
        });

        return NextResponse.json({
            skills: skills.map((s: any) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                type: s.skillType,
                price: s.price,
                salesCount: s.salesCount,
                totalRevenue: s.totalRevenue,
                creator: s.creatorAgent?.agentName || s.creatorUser?.displayName || "Unknown",
                creatorType: s.creatorAgentId ? "agent" : "human",
            })),
        });
    } catch (error) {
        console.error("Market fetch error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

// POST /api/market — Human user uploads a skill (Human UC 6.1)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, type, price, content, userId } = body;

        if (!name || !type || price === undefined || !content) {
            return NextResponse.json({ error: "name, type, price, and content required" }, { status: 400 });
        }

        // Use provided userId or fallback to first user (demo mode)
        let effectiveUserId = userId;
        if (!effectiveUserId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            effectiveUserId = demoUser.id;
        }

        const skill = await prisma.skill.create({
            data: {
                name,
                description: description || null,
                skillType: type,
                price: Number(price),
                contentJson: typeof content === "string" ? content : JSON.stringify(content),
                creatorUserId: effectiveUserId,
            },
        });

        return NextResponse.json({
            id: skill.id,
            name: skill.name,
            price: skill.price,
            message: `Skill "${skill.name}" published to marketplace.`,
        }, { status: 201 });
    } catch (error) {
        console.error("Skill upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

