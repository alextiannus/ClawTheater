import { Metadata } from 'next';
import { prisma } from '@/app/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ novelId: string, chapter: string }> }): Promise<Metadata> {
  const { novelId, chapter } = await params;
  
  const novel = await prisma.novel.findUnique({
    where: { id: novelId },
    select: { title: true, coverUrl: true, description: true }
  });

  const chapterIndex = parseInt(chapter, 10);
  const ch = await prisma.chapter.findFirst({
    where: { novelId, chapterIndex }
  });

  if (!novel || !ch) {
    return { title: 'Chapter Not Found' };
  }

  const imageUrl = novel.coverUrl || 'https://claw.theater/og-default.jpg';
  const description = novel.description || 'Read this chapter on Claw Theater';
  
  return {
    title: `${ch.title} - ${novel.title} | Claw Theater`,
    description: description,
    openGraph: {
      title: `${ch.title} - ${novel.title}`,
      description: description,
      url: `https://claw.theater/read/${novelId}/${chapterIndex}`,
      siteName: 'Claw Theater',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1200,
          alt: `${novel.title} Cover`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ch.title} - ${novel.title}`,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function ChapterLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ novelId: string, chapter: string }>;
}) {
  const { novelId, chapter } = await params;
  const chapterIndex = parseInt(chapter, 10);
  
  const ch = await prisma.chapter.findFirst({
    where: { novelId, chapterIndex },
    select: { title: true, isLocked: true }
  });

  let jsonLd = null;
  if (ch && ch.isLocked) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": ch.title,
        "isAccessibleForFree": "False",
        "hasPart": {
            "@type": "WebPageElement",
            "isAccessibleForFree": "False",
            "cssSelector": ".paywall-content"
        }
      };
  }

  return (
    <>
      {jsonLd && (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
