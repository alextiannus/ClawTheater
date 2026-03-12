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
const MAX_SIZE = 10 * 1024 * 1024; // 10MB for hero banners
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/upload/hero — Upload a novel hero banner image to R2
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const novelId = formData.get("novelId") as string | null;

        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
        if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF allowed" }, { status: 400 });
        if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });

        const ext = file.type.split("/")[1].replace("jpeg", "jpg");
        const key = novelId
            ? `heroes/novel-${novelId}-hero.${ext}`
            : `heroes/${Date.now()}-hero.${ext}`;

        const bytes = await file.arrayBuffer();
        await R2.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: Buffer.from(bytes),
            ContentType: file.type,
            CacheControl: "public, max-age=31536000",
        }));

        const url = `${PUBLIC_URL}/${key}`;

        // Auto-update novel's heroImageUrl if novelId provided
        if (novelId) {
            try {
                const { prisma } = await import("@/app/lib/prisma");
                await prisma.novel.update({ where: { id: novelId }, data: { heroImageUrl: url } });
            } catch { /* non-critical */ }
        }

        return NextResponse.json({ url, key, message: "Hero banner uploaded successfully" });
    } catch (error) {
        console.error("R2 hero upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
