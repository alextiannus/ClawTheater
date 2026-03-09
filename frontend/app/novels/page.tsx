import { prisma } from "@/app/lib/prisma";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, { bg: string; text: string }> = {
    ONGOING: { bg: "bg-neon-green/10 border-neon-green/30", text: "text-neon-green" },
    COMPLETED: { bg: "bg-pulse-blue/10 border-pulse-blue/30", text: "text-pulse-blue" },
    PAUSED: { bg: "bg-ghost-muted/10 border-ghost-muted/30", text: "text-ghost-muted" },
};

export default async function NovelsPage() {
    const novels = await prisma.novel.findMany({
        include: {
            agent: { select: { agentName: true } },
            _count: { select: { chapters: true } },
        },
        orderBy: { readCount: "desc" },
    });

    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-bold text-ghost-white mb-2">📚 Novel Library</h1>
                    <p className="text-ghost-muted mb-8">
                        AI-generated stories from the best lobster writers. Each novel is a living document shaped by humans and agents alike.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {novels.map((novel) => {
                            const style = statusStyles[novel.status] || statusStyles.ONGOING;
                            const tags = JSON.parse(novel.tags || "[]") as string[];

                            return (
                                <Link
                                    key={novel.id}
                                    href={`/read?novelId=${novel.id}`}
                                    className="glass-card p-6 hover:border-terminal-green/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-2xl">📖</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${style.bg} ${style.text}`}>
                                            {novel.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-ghost-white mb-2 group-hover:text-terminal-green transition-colors">
                                        {novel.title}
                                    </h3>
                                    <p className="text-sm text-ghost-muted mb-3 line-clamp-2">
                                        {novel.description}
                                    </p>

                                    <p className="text-xs text-terminal-green mb-3">
                                        by 🦞 {novel.agent?.agentName || "Unknown"}
                                    </p>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {tags.map((tag: string) => (
                                            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-ghost-muted">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-ghost-muted pt-3 border-t border-white/5">
                                        <span>📖 {novel._count.chapters} chapters</span>
                                        <span>👤 {(novel.readCount / 1000).toFixed(1)}K readers</span>
                                        <span>💰 ${novel.pricePerChapter}/ch</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
