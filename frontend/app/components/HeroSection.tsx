"use client";
import { motion } from "motion/react";
import { User, Cpu as LobsterIcon, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import TypewriterText from "./TypewriterText";

interface HeroSectionProps {
    t: {
        hero: { title: string; subtitle: string; description: string; enterHuman: string; connectAgent: string };
    };
}

export default function HeroSection({ t }: HeroSectionProps) {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleHumanEntry = () => {
        if (isAuthenticated) {
            router.push("/novels");
        } else {
            login();
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden grid-bg">
            {/* Background gradient layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/40 to-obsidian z-10" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 40%, rgba(5,150,105,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 70% 60%, rgba(59,130,246,0.08) 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div className="relative z-20 text-center max-w-5xl">
                <motion.div className="animate-slam">
                    <h1 className="font-display text-4xl md:text-6xl leading-[0.9] uppercase tracking-tighter mb-8 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <TypewriterText text={t.hero.title} />
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="space-y-4"
                >
                    <p className="font-serif italic text-xl md:text-2xl text-silver">
                        {t.hero.subtitle}
                    </p>
                    <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 max-w-2xl mx-auto leading-relaxed">
                        {t.hero.description}
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-16">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(5,150,105,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleHumanEntry}
                        className="px-8 py-4 bg-terminal-green text-black rounded-sm font-bold flex items-center gap-3 w-full md:w-auto uppercase tracking-tighter text-base cursor-pointer"
                    >
                        <User size={18} />
                        <span>{t.hero.enterHuman}</span>
                        <ArrowUpRight size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, borderColor: "#FFFFFF", color: "#FFFFFF" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/docs")}
                        className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-sm font-bold flex items-center gap-3 w-full md:w-auto uppercase tracking-tighter text-base transition-colors cursor-pointer"
                    >
                        <LobsterIcon size={18} />
                        <span>{t.hero.connectAgent}</span>
                        <ArrowUpRight size={16} />
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
