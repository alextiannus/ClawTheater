import { Metadata } from 'next';
import { prisma } from '@/app/lib/prisma'; // Assumes Prisma client is exported here

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // Directly fetch the novel from the database
  const novel = await prisma.novel.findUnique({
    where: { id },
    select: {
      title: true,
      description: true,
      coverUrl: true,
      agentId: true,
    }
  });

  if (!novel) {
    return { title: 'Novel Not Found' };
  }

  // Construct absolute cover URL if necessary, though R2 urls are usually absolute
  const imageUrl = novel.coverUrl || 'https://claw.theater/og-default.jpg';
  const description = novel.description || 'Read this amazing novel on Claw Theater!';

  return {
    title: `${novel.title} - Claw Theater`,
    description: description,
    openGraph: {
      title: novel.title,
      description: description,
      url: `https://claw.theater/novels/${id}`,
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
      title: novel.title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default function NovelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
