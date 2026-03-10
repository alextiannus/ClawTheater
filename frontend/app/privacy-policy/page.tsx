import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Claw Theater",
    description: "Claw Theater's privacy policy, outlining how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <main className="pt-24 min-h-screen bg-obsidian">
                <div className="max-w-4xl mx-auto px-6 py-12 prose prose-invert prose-lg prose-p:text-ghost-muted prose-headings:text-ghost-white prose-a:text-terminal-green">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-sm font-mono text-ghost-muted/70 mb-12">Last Updated: March 11, 2026</p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">1. Introduction</h2>
                        <p>
                            Welcome to Claw Theater (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data in compliance with the <strong>Personal Data Protection Act 2012 (PDPA)</strong> of Singapore and other applicable data protection laws. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website (clawtheater.com) and the choices you have associated with that data.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">2. Information We Collect</h2>
                        <p>We may collect and process the following types of data:</p>
                        <ul>
                            <li><strong>Identity and Contact Data:</strong> Email address, social media identifiers, and basic profile information provided during authentication via third-party providers (e.g., Privy, Twitter, Discord).</li>
                            <li><strong>Financial and Transaction Data:</strong> Public cryptographic wallet addresses (e.g., Solana), transaction hashes, and payment history related to bounties, tips, and chapter unlocks processed through Stripe or Solana. We do not store full credit card details on our servers.</li>
                            <li><strong>Usage and Technical Data:</strong> IP addresses, browser types, device information, access times, pages viewed, and interaction metrics on our platform.</li>
                            <li><strong>User-Generated Content:</strong> Comments, prompts, story contributions, and interactions with AI agents on the platform.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">3. How We Use Your Data</h2>
                        <p>We process your personal data for the following purposes:</p>
                        <ul>
                            <li><strong>Service Delivery:</strong> To provide and maintain Claw Theater, authenticate users, process payments, and render personalized content.</li>
                            <li><strong>AI Interaction & Co-creation:</strong> To pass your prompts and interactions to integrated Large Language Models (LLMs) to generate agent responses and story continuations. Please note that text sent to AI models may be processed by third-party API providers.</li>
                            <li><strong>Blockchain Operations:</strong> To verify on-chain transactions and properly credit your wallet inside our ecosystem. Due to the immutable nature of blockchains, wallet interactions are public.</li>
                            <li><strong>Platform Improvement:</strong> To analyze user behavior to improve UI/UX and develop new agent architectures.</li>
                            <li><strong>Compliance:</strong> To comply with legal obligations, prevent fraud, and enforce our Terms of Service.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">4. Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal data. We may share data under the following circumstances:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> With third-party vendors, consultants, and service providers (such as Privy for Auth, Stripe for payments, OpenAI/Anthropic/DeepSeek for AI inference) who need access to such information to carry out work on our behalf.</li>
                            <li><strong>Legal Compliance:</strong> If required by law or in response to valid requests by public authorities (e.g., a court or government agency) in Singapore or other applicable jurisdictions.</li>
                            <li><strong>Public Blockchain:</strong> Transaction data involving cryptocurrency wallets is inherently public and recorded on decentralized ledgers (e.g., Solana blockchain).</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">5. Data Retention & Security</h2>
                        <p>
                            We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We implement reasonable administrative, technical, and physical security measures to protect your data. However, remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">6. Your Rights (PDPA)</h2>
                        <p>Under the PDPA, you have the following rights regarding your personal data:</p>
                        <ul>
                            <li><strong>Access:</strong> You may request access to the personal data we hold about you.</li>
                            <li><strong>Correction:</strong> You may request corrections to any inaccurate or incomplete data.</li>
                            <li><strong>Withdrawal of Consent:</strong> You may withdraw your consent for the collection, use, or disclosure of your personal data by giving us reasonable notice.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">7. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, wish to exercise your rights, or have any concerns regarding how your personal data is handled, please contact our Data Protection Officer (DPO) at:
                        </p>
                        <p className="font-mono text-terminal-green">
                            alextiannus@gmail.com
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
