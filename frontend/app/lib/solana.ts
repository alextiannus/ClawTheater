/**
 * app/lib/solana.ts
 * Server-side Solana revenue split helper — Phase 1 (Devnet test)
 *
 * Revenue split: 80% creator · 10% lore owner · 10% platform (retained)
 *
 * Phase 1 uses SOL on Devnet as a proxy for USDC.
 * 1 USD ≈ TEST_LAMPORTS_PER_USD lamports for integration testing.
 * Upgrade to mainnet + USDC SPL transfers for production.
 */

import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// ─── Config ────────────────────────────────────────────────────────
const USE_DEVNET = process.env.SOLANA_NETWORK !== "mainnet";
const RPC_URL = USE_DEVNET
    ? (process.env.SOLANA_DEVNET_RPC || "https://api.devnet.solana.com")
    : (process.env.SOLANA_MAINNET_RPC || "https://api.mainnet-beta.solana.com");

// Test conversion: 1 USD = 0.001 SOL = 1_000_000 lamports on Devnet
// Adjust once real USDC SPL integration is in place
const TEST_LAMPORTS_PER_USD = 1_000_000;

const REVENUE_SPLIT = {
    creator: 0.80,
    lore: 0.10,
    platform: 0.10,
};

// ─── Platform Keypair ───────────────────────────────────────────────
export function getPlatformKeypair(): Keypair | null {
    const raw = process.env.PLATFORM_SOLANA_PRIVATE_KEY;
    if (!raw) return null;
    try {
        // Accept base58-encoded 64-byte secret key or comma-separated uint8 array
        if (raw.includes(",")) {
            return Keypair.fromSecretKey(Uint8Array.from(raw.split(",").map(Number)));
        }
        // base58 decode via Buffer
        const bytes = Buffer.from(raw, "base64");
        return Keypair.fromSecretKey(bytes);
    } catch {
        console.error("[solana] Failed to decode PLATFORM_SOLANA_PRIVATE_KEY");
        return null;
    }
}

export function generateWallet(): { publicKey: string; privateKeyBase64: string } {
    const kp = Keypair.generate();
    return {
        publicKey: kp.publicKey.toBase58(),
        privateKeyBase64: Buffer.from(kp.secretKey).toString("base64"),
    };
}

// ─── Core Split Function ────────────────────────────────────────────
export interface SplitResult {
    txSignature: string;
    network: "devnet" | "mainnet";
    split: {
        creator: { wallet: string; lamports: number; usd: number };
        lore: { wallet: string | null; lamports: number; usd: number } | null;
        platform: { lamports: number; usd: number };
    };
}

export async function splitPayment(opts: {
    amountUSD: number;
    creatorWallet: string;
    loreWallet?: string | null;
}): Promise<SplitResult | null> {
    const platformKP = getPlatformKeypair();
    if (!platformKP) {
        console.warn("[solana] No platform keypair configured — skipping on-chain split");
        return null;
    }

    const { amountUSD, creatorWallet, loreWallet } = opts;

    const totalLamports = Math.round(amountUSD * TEST_LAMPORTS_PER_USD);
    const creatorLamports = Math.round(totalLamports * REVENUE_SPLIT.creator);
    const loreLamports = loreWallet ? Math.round(totalLamports * REVENUE_SPLIT.lore) : 0;
    // Platform retains the rest (no explicit transfer needed)

    const connection = new Connection(RPC_URL, "confirmed");

    // Auto-airdrop platform wallet on Devnet if low balance
    if (USE_DEVNET) {
        const balance = await connection.getBalance(platformKP.publicKey);
        if (balance < totalLamports * 2) {
            try {
                const sig = await connection.requestAirdrop(platformKP.publicKey, 2 * LAMPORTS_PER_SOL);
                await connection.confirmTransaction(sig, "confirmed");
                console.log(`[solana] Devnet airdrop: 2 SOL → platform wallet`);
            } catch {
                console.warn("[solana] Airdrop failed — wallet may already be funded");
            }
        }
    }

    // Build transaction
    const tx = new Transaction();

    // Creator share (80%)
    tx.add(SystemProgram.transfer({
        fromPubkey: platformKP.publicKey,
        toPubkey: new PublicKey(creatorWallet),
        lamports: creatorLamports,
    }));

    // Lore owner share (10%) if applicable
    if (loreWallet && loreLamports > 0) {
        tx.add(SystemProgram.transfer({
            fromPubkey: platformKP.publicKey,
            toPubkey: new PublicKey(loreWallet),
            lamports: loreLamports,
        }));
    }

    try {
        const txSignature = await sendAndConfirmTransaction(connection, tx, [platformKP], {
            commitment: "confirmed",
        });

        const exploreUrl = USE_DEVNET
            ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
            : `https://explorer.solana.com/tx/${txSignature}`;

        console.log(`[solana] ✅ Split complete: ${exploreUrl}`);

        return {
            txSignature,
            network: USE_DEVNET ? "devnet" : "mainnet",
            split: {
                creator: { wallet: creatorWallet, lamports: creatorLamports, usd: amountUSD * REVENUE_SPLIT.creator },
                lore: loreWallet ? { wallet: loreWallet, lamports: loreLamports, usd: amountUSD * REVENUE_SPLIT.lore } : null,
                platform: { lamports: totalLamports - creatorLamports - loreLamports, usd: amountUSD * REVENUE_SPLIT.platform },
            },
        };
    } catch (err) {
        console.error("[solana] Transfer failed:", err);
        return null;
    }
}
