import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/dashboard?userId=... — Fetch user dashboard data
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let userId = searchParams.get("userId");

        // Fallback to first user (demo mode)
        if (!userId) {
            const demoUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (!demoUser) return NextResponse.json({ error: "No users in database" }, { status: 500 });
            userId = demoUser.id;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                fundings: {
                    include: {
                        bounty: { select: { title: true, status: true, totalFunded: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                tips: {
                    include: {
                        chapter: {
                            select: { title: true, novel: { select: { title: true } } },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
                comments: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate total earned (from bounty dividends — simplified: sum of all fundings that are RESOLVED)
        const totalEarned = user.fundings
            .filter(f => f.bounty.status === "RESOLVED")
            .reduce((sum, f) => sum + f.amount * 0.3, 0); // 30% back to funders

        // Calculate total spent
        const totalSpent = user.tips.reduce((sum, t) => sum + t.amount, 0) +
            user.fundings.reduce((sum, f) => sum + f.amount, 0);

        // Build portfolio
        const portfolio = user.fundings.map(f => ({
            bountyTitle: f.bounty.title,
            funded: f.amount,
            status: f.bounty.status,
            dividend: f.bounty.status === "RESOLVED" ? f.amount * f.proportion * 0.3 : 0,
        }));

        // Build transaction history (merge tips + fundings, sorted by date)
        type Transaction = { type: string; desc: string; amount: number; time: string };
        const transactions: Transaction[] = [];

        for (const tip of user.tips) {
            transactions.push({
                type: "TIP",
                desc: `Tipped ${tip.chapter?.novel?.title || "Novel"} — ${tip.chapter?.title || "Chapter"}`,
                amount: -tip.amount,
                time: relativeTime(tip.createdAt),
            });
        }

        for (const funding of user.fundings) {
            transactions.push({
                type: "FUND",
                desc: `Funded "${funding.bounty.title}"`,
                amount: -funding.amount,
                time: relativeTime(funding.createdAt),
            });
            if (funding.bounty.status === "RESOLVED") {
                transactions.push({
                    type: "DIVIDEND",
                    desc: `Revenue share from "${funding.bounty.title}"`,
                    amount: funding.amount * funding.proportion * 0.3,
                    time: relativeTime(funding.createdAt),
                });
            }
        }

        // Sort by most recent
        transactions.sort((a, b) => 0); // Already in order from DB

        return NextResponse.json({
            user: {
                displayName: user.displayName || "Anonymous",
                walletAddress: user.walletAddress || "Not connected",
                usdcBalance: user.usdcBalance,
                totalEarned,
                totalSpent,
            },
            portfolio,
            transactions: transactions.slice(0, 20),
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}

function relativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
}
