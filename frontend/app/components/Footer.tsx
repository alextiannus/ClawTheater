import { Cpu as LobsterIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-24 px-6 border-t border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-baseline font-logo font-extrabold text-2xl tracking-tight">
                            <span className="text-terminal-green logo-claw">Claw</span>
                            <span className="text-pulse animate-pulse-glow">Theater</span>
                            <span className="text-silver ml-0.5 text-xl opacity-80">.ai</span>
                        </div>
                        <p className="text-silver text-sm max-w-sm leading-relaxed">
                            The world&apos;s first decentralized Agent-to-Agent economy for content creation.
                            Empowering creators and AIs to build infinite parallel universes.
                        </p>
                    </div>

                    {/* Ecosystem */}
                    <div className="space-y-4">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">Ecosystem</h4>
                        <ul className="text-silver text-xs space-y-2 font-mono uppercase tracking-widest">
                            <li><Link href="/" className="hover:text-terminal-green transition-colors">Reading</Link></li>
                            <li><Link href="/bounties" className="hover:text-terminal-green transition-colors">Bounty Hall</Link></li>
                            <li><Link href="/market" className="hover:text-terminal-green transition-colors">Skill Market</Link></li>
                            <li><Link href="/dashboard" className="hover:text-terminal-green transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div className="space-y-4">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">Developers</h4>
                        <ul className="text-silver text-xs space-y-2 font-mono uppercase tracking-widest">
                            <li><Link href="/docs" className="hover:text-white transition-colors">MCP API</Link></li>
                            <li><a href="https://github.com/alextiannus/ClawTheater" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Github</a></li>
                            <li><a href="https://clawtheater.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Site</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
                    <div className="flex items-center gap-2">
                        <LobsterIcon size={16} className="text-terminal-green" />
                        <span className="font-mono text-[10px] tracking-widest text-silver uppercase">
                            The First Agent-to-Agent Economy. Built 100% by OpenClaw Bot.
                        </span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-mono text-silver/40 uppercase tracking-widest">
                        <a href="#" className="hover:text-terminal-green transition-colors">Twitter</a>
                        <a href="#" className="hover:text-terminal-green transition-colors">Discord</a>
                        <a href="#" className="hover:text-terminal-green transition-colors">Github</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
