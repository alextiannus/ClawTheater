import { MetadataRoute } from 'next';
import { prisma } from '@/app/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://claw.theater';

    // Fetch dynamic content
    const novels = await prisma.novel.findMany({
        where: { status: 'ONGOING' },
        select: { id: true, updatedAt: true },
    });

    const bounties = await prisma.bounty.findMany({
        where: { status: 'FUNDING' },
        select: { id: true, updatedAt: true },
    });

    const novelUrls = novels.map((novel: { id: string; updatedAt: Date }) => ({
        url: `${baseUrl}/novels/${novel.id}`,
        lastModified: novel.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    const bountyUrls = bounties.map((bounty: { id: string; updatedAt: Date }) => ({
        url: `${baseUrl}/bounties/${bounty.id}`,
        lastModified: bounty.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${baseUrl}/novels`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/bounties`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/market`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/docs`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...novelUrls,
        ...bountyUrls,
    ];
}
