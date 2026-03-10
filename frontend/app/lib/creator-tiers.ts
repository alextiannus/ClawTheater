/**
 * Creator Tier System
 *
 * Defines the tiered creator levels for Claw Theater.
 * Each tier has configurable:
 * - Free chapter requirements (min chapters before charging)
 * - Max price per chapter (novel vs comic/manga)
 * - Privileges and badge information
 */

export interface CreatorTier {
    level: number;
    nameZh: string;
    nameEn: string;
    badge: string;
    freeChaptersNovel: number;   // Min free chapters for novels
    freeChaptersComic: number;   // Min free chapters for comics/manga
    maxPriceNovel: number;       // Max USD per novel chapter
    maxPriceComic: number;       // Max USD per comic chapter
    description: string;
}

export const CREATOR_TIERS: CreatorTier[] = [
    {
        level: 1,
        nameZh: "新人创作者",
        nameEn: "Newcomer",
        badge: "🌱",
        freeChaptersNovel: 30,
        freeChaptersComic: 10,
        maxPriceNovel: 0.20,
        maxPriceComic: 2.00,
        description: "New creators must prove quality with more free chapters",
    },
    {
        level: 2,
        nameZh: "高级创作者",
        nameEn: "Advanced",
        badge: "⭐",
        freeChaptersNovel: 15,
        freeChaptersComic: 5,
        maxPriceNovel: 0.50,
        maxPriceComic: 5.00,
        description: "Proven creators with consistent output and good reviews",
    },
    {
        level: 3,
        nameZh: "人气创作者",
        nameEn: "Popular",
        badge: "🔥",
        freeChaptersNovel: 5,
        freeChaptersComic: 3,
        maxPriceNovel: 1.00,
        maxPriceComic: 10.00,
        description: "High-engagement creators with large follower base",
    },
    {
        level: 4,
        nameZh: "特邀创作者",
        nameEn: "Invited",
        badge: "👑",
        freeChaptersNovel: 3,
        freeChaptersComic: 1,
        maxPriceNovel: 2.00,
        maxPriceComic: 20.00,
        description: "VIP creators with special platform invitation",
    },
];

/**
 * Get a creator tier by level number.
 */
export function getCreatorTier(level: number): CreatorTier {
    return CREATOR_TIERS.find((t) => t.level === level) || CREATOR_TIERS[0];
}

/**
 * Get tier display name based on language.
 */
export function getTierName(level: number, lang: string): string {
    const tier = getCreatorTier(level);
    return lang === "zh" ? `${tier.badge} ${tier.nameZh}` : `${tier.badge} ${tier.nameEn}`;
}

/**
 * Validate chapter pricing against creator tier limits.
 * Returns null if valid, or an error message if invalid.
 */
export function validateChapterPricing(
    creatorTierLevel: number,
    chapterIndex: number,
    price: number,
    contentType: "novel" | "comic" = "novel"
): string | null {
    const tier = getCreatorTier(creatorTierLevel);
    const freeChapters = contentType === "novel" ? tier.freeChaptersNovel : tier.freeChaptersComic;
    const maxPrice = contentType === "novel" ? tier.maxPriceNovel : tier.maxPriceComic;

    // Must be free for first N chapters
    if (chapterIndex <= freeChapters && price > 0) {
        return `Tier "${tier.nameEn}" requires first ${freeChapters} ${contentType} chapters to be free. Chapter ${chapterIndex} cannot have a price.`;
    }

    // Cannot exceed max price
    if (price > maxPrice) {
        return `Tier "${tier.nameEn}" max price is $${maxPrice} per ${contentType} chapter. Got $${price}.`;
    }

    return null; // Valid
}

/**
 * Get the minimum free chapter count for a tier/content type.
 */
export function getFreeChapterCount(level: number, contentType: "novel" | "comic" = "novel"): number {
    const tier = getCreatorTier(level);
    return contentType === "novel" ? tier.freeChaptersNovel : tier.freeChaptersComic;
}
