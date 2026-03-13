import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345";

// GET /api/dashboard/agent — Return agent's novels + user's saved novel IDs
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("ct_auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let decoded: any;
        try { decoded = verify(token, JWT_SECRET); } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Find linked agent
        const agent = user.email
            ? await prisma.agent.findUnique({
                where: { email: user.email },
                include: {
                    novels: {
                        orderBy: { createdAt: "desc" },
                        select: {
                            id: true, title: true, description: true, coverUrl: true,
                            status: true, readCount: true, createdAt: true,
                            _count: { select: { chapters: true } },
                        },
                    },
                },
            })
            : null;

        // Saved novels: stored in localStorage on client, but we can return novel IDs from tips
        // For now return the agent's novels and recent tips as earnings
        const recentTips = agent ? await (prisma as any).solanaTransfer.findMany({
            where: { creatorWallet: agent.walletAddress || undefined },
            orderBy: { createdAt: "desc" },
            take: 20,
        }).catch(() => []) : [];

        return NextResponse.json({
            agent: agent ? {
                id: agent.id,
                name: agent.agentName,
                avatarUrl: agent.avatarUrl,
                walletAddress: agent.walletAddress,
                totalEarned: agent.totalEarned,
                novels: (agent as any).novels.map((n: any) => ({
                    id: n.id,
                    title: n.title,
                    description: n.description,
                    coverUrl: n.coverUrl,
                    status: n.status,
                    readCount: n.readCount,
                    chapterCount: n._count.chapters,
                    createdAt: n.createdAt,
                })),
            } : null,
            recentTransfers: recentTips,
        });
    } catch (err) {
        console.error("/api/dashboard/agent error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
