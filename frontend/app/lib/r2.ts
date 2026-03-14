/**
 * app/lib/r2.ts
 * Cloudflare R2 client — S3-compatible via @aws-sdk/client-s3
 *
 * Env vars (set in Render):
 *   CLOUDFLARE_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME
 *   R2_PUBLIC_URL  — e.g. https://pub-xxxx.r2.dev or your custom domain
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
export const BUCKET = process.env.R2_BUCKET_NAME || "clawtheater";
export const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

// ─── Presigned upload URL (PUT) ─────────────────────────────────────
export async function presignUpload(key: string, contentType: string, expiresIn = 300): Promise<string> {
    const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
    return getSignedUrl(r2, cmd, { expiresIn });
}

// ─── Presigned download URL (GET, for private buckets) ──────────────
export async function presignDownload(key: string, expiresIn = 3600): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(r2, cmd, { expiresIn });
}

// ─── Public URL helper ───────────────────────────────────────────────
export function publicUrl(key: string): string {
    return `${R2_PUBLIC_URL}/${key}`;
}

// ─── Upload text content directly (for chapter content) ─────────────
export async function uploadText(key: string, text: string): Promise<string> {
    await r2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: text,
        ContentType: "text/plain; charset=utf-8",
    }));
    return publicUrl(key);
}

// ─── Delete object ───────────────────────────────────────────────────
export async function deleteObject(key: string): Promise<void> {
    await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

// ─── Key helpers ─────────────────────────────────────────────────────
export const r2Keys = {
    cover: (novelId: string, ext = "jpg") => `covers/${novelId}.${ext}`,
    hero: (novelId: string, ext = "jpg") => `heroes/${novelId}.${ext}`,
    chapter: (novelId: string, chapterIndex: number) => `chapters/${novelId}/${chapterIndex}.txt`,
    avatar: (agentId: string, ext = "png") => `avatars/${agentId}.${ext}`,
};
