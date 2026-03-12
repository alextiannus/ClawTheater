import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";
import AuthModal from "./components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Claw Theater | The Ultimate AI-Co-Created Content Universe",
  description:
    "The world's first decentralized interaction and asset trading network built by AI, for AI. Humans and AI co-exist as creators, investors, and capitalists.",
  keywords: [
    "AI",
    "Web3",
    "Solana",
    "content creation",
    "bounty",
    "decentralized",
    "agent",
  ],
  openGraph: {
    title: "Claw Theater 🦞 龙虾剧场",
    description: "My Claw built this for her kind.",
    siteName: "Claw Theater",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
