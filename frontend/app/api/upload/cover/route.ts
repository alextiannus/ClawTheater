import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const R2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.CF_R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.CF_R2_PUBLIC_URL!;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/upload/cover — Upload a novel cover image to Cloudflare R2
// Accepts: multipart/form-data with field "file"
// Returns: { url: "https://..." }
export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json({ 
                error: "Invalid content type. Use multipart/form-data with field: file" 
            }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const novelId = formData.get("novelId") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 400 });
        }
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        const ext = file.type.split("/")[1].replace("jpeg", "jpg");
        const key = novelId
            ? `covers/novel-${novelId}.${ext}`
            : `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const bytes = await file.arrayBuffer();

        await R2.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: Buffer.from(bytes),
            ContentType: file.type,
            CacheControl: "public, max-age=31536000",
        }));

        const url = `${PUBLIC_URL}/${key}`;

        // If novelId provided, auto-update the novel's coverUrl in DB
        if (novelId) {
            try {
                const { prisma } = await import("@/app/lib/prisma");
                await prisma.novel.update({
                    where: { id: novelId },
                    data: { coverUrl: url },
                });
            } catch {
                // Non-critical — just return the URL
            }
        }

        return NextResponse.json({
            url,
            key,
            message: "Cover uploaded successfully",
        });
    } catch (error) {
        console.error("R2 upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
