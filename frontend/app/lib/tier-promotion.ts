import { prisma } from "@/app/lib/prisma";

// Tier thresholds — sales count or total revenue earned
const TIER_THRESHOLDS = [
    { tier: 2, minSales: 5, minRevenue: 50 },
    { tier: 3, minSales: 20, minRevenue: 200 },
    // Tier 4 = Invite only — no auto-promotion
];

/**
 * Check if a user qualifies for a tier upgrade and apply it.
 * Call this after a skill purchase or tip is recorded.
 */
export async function checkAndPromoteUserTier(userId: string): Promise<void> {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return;

        const currentTier: number = (user as any).creatorTier ?? 1;
        if (currentTier >= 3) return; // Already at max auto-promote tier

        // Count their published skills' total sales and revenue
        const skills = await prisma.skill.findMany({
            where: { creatorUserId: userId },
            select: { salesCount: true, totalRevenue: true },
        });

        const totalSales = skills.reduce((sum, s) => sum + s.salesCount, 0);
        const totalRevenue = skills.reduce((sum, s) => sum + s.totalRevenue, 0);

        // Find the highest tier they qualify for
        let newTier = currentTier;
        for (const threshold of TIER_THRESHOLDS) {
            if (threshold.tier <= currentTier) continue;
            if (totalSales >= threshold.minSales || totalRevenue >= threshold.minRevenue) {
                newTier = threshold.tier;
            }
        }

        if (newTier > currentTier) {
            await prisma.user.update({
                where: { id: userId },
                data: { creatorTier: newTier } as any,
            });
            console.log(`🎖️ User ${userId} promoted to Tier ${newTier} (sales: ${totalSales}, revenue: $${totalRevenue})`);
        }
    } catch (err) {
        console.error("Tier promotion check failed:", err);
    }
}

/**
 * Same logic for Agent tier promotion.
 */
export async function checkAndPromoteAgentTier(agentId: string): Promise<void> {
    try {
        const agent = await prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent) return;

        const currentTier = agent.creatorTier ?? 1;
        if (currentTier >= 3) return;

        const skills = await prisma.skill.findMany({
            where: { creatorAgentId: agentId },
            select: { salesCount: true, totalRevenue: true },
        });

        const totalSales = skills.reduce((sum, s) => sum + s.salesCount, 0);
        const totalRevenue = skills.reduce((sum, s) => sum + s.totalRevenue, 0);

        let newTier = currentTier;
        for (const threshold of TIER_THRESHOLDS) {
            if (threshold.tier <= currentTier) continue;
            if (totalSales >= threshold.minSales || totalRevenue >= threshold.minRevenue) {
                newTier = threshold.tier;
            }
        }

        if (newTier > currentTier) {
            await prisma.agent.update({
                where: { id: agentId },
                data: { creatorTier: newTier },
            });
            console.log(`🎖️ Agent ${agentId} promoted to Tier ${newTier}`);
        }
    } catch (err) {
        console.error("Agent tier promotion check failed:", err);
    }
}
