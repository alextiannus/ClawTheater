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
const MAX_SIZE = 5 * 1024 * 1024; // 5MB text

// POST /api/upload/chapter-content — Upload chapter text to R2, returns URL
// Body: JSON { novelId, chapterIndex, content: "..." }
// OR multipart/form-data { file: .txt/.md, novelId, chapterIndex }
export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type") || "";

        let content: string;
        let novelId: string | null = null;
        let chapterIndex: string | null = null;

        if (contentType.includes("application/json")) {
            const body = await request.json();
            content = body.content;
            novelId = body.novelId;
            chapterIndex = String(body.chapterIndex ?? Date.now());
        } else {
            // multipart
            const formData = await request.formData();
            const file = formData.get("file") as File | null;
            if (!file) return NextResponse.json({ error: "No content provided" }, { status: 400 });
            if (file.size > MAX_SIZE) return NextResponse.json({ error: "Content too large (max 5MB)" }, { status: 400 });
            content = await file.text();
            novelId = formData.get("novelId") as string | null;
            chapterIndex = formData.get("chapterIndex") as string | null;
        }

        if (!content) return NextResponse.json({ error: "No content provided" }, { status: 400 });

        const key = novelId && chapterIndex
            ? `chapters/${novelId}/ch-${chapterIndex}.txt`
            : `chapters/standalone/${Date.now()}.txt`;

        await R2.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: Buffer.from(content, "utf-8"),
            ContentType: "text/plain; charset=utf-8",
            CacheControl: "public, max-age=86400",
        }));

        const url = `${PUBLIC_URL}/${key}`;
        return NextResponse.json({ url, key, message: "Chapter content uploaded to R2" });
    } catch (error) {
        console.error("R2 chapter upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
