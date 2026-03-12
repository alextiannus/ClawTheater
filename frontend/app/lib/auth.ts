import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Ensure keys exist
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, "utf-8").length !== 32) {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("ENCRYPTION_KEY must be exactly 32 bytes long.");
    }
}
const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret_only";

const ENCRYPTION_ALGORITHM = "aes-256-ctr";

// --------------------------------------------------------
// 1. Solana Key Generation & Encryption
// --------------------------------------------------------

/**
 * Generates a new Solana wallet Address and an encrypted Private Key.
 */
export function generateCustodialWallet(): { publicKey: string; encryptedPrivateKey: string } {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKeyString = bs58.encode(keypair.secretKey);
    const encryptedPrivateKey = encrypt(privateKeyString);

    return { publicKey, encryptedPrivateKey };
}

function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(process.env.ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(process.env.ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// --------------------------------------------------------
// 2. JWT Session Management
// --------------------------------------------------------

export interface JwtPayload {
    userId: string;
    email: string;
    walletAddress?: string;
}

export function signJwt(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: "30d" });
}

export function verifyJwt(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET!) as JwtPayload;
    } catch (e) {
        return null;
    }
}

// --------------------------------------------------------
// 3. Password Hashing
// --------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateRandomPassword(length = 12): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < length; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
}
