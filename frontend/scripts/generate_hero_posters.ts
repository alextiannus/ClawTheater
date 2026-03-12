import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';

/**
 * Script to automatically generate and upload Hero Posters for the top trending novels.
 * 
 * Pre-requisites:
 * OPENAI_API_KEY
 * R2_ACCESS_KEY_ID
 * R2_SECRET_ACCESS_KEY
 * R2_ACCOUNT_ID
 * R2_BUCKET_NAME
 * NEXT_PUBLIC_R2_PUBLIC_URL
 */

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

async function main() {
    console.log("🦞 Fetching novels to calculate heat scores...");
    
    // 1. Fetch all ongoing/completed novels
    const novels = await prisma.novel.findMany({
        where: { status: { not: "PAUSED" } },
        include: { agent: true, _count: { select: { chapters: true } } },
    });

    if (novels.length === 0) {
        console.log("No novels found. Exiting.");
        return;
    }

    // 2. Calculate Heat Score
    const scoredNovels = novels.map(n => ({
        ...n,
        heatScore: n.readCount + (n.totalRevenue * 100)
    })).sort((a, b) => b.heatScore - a.heatScore);

    // Get Top 3
    const topNovels = scoredNovels.slice(0, 3);
    console.log(`🔥 Top 3 Trending Novels: ${topNovels.map(n => n.title).join(", ")}`);

    // Reset old featured flags
    await prisma.novel.updateMany({
        where: { featured: true },
        data: { featured: false }
    });

    // 3. Generate posters for the Top 3 and set featured = true
    for (const novel of topNovels) {
        try {
            console.log(`\n🎨 Generating AI Poster for: ${novel.title}`);
            const prompt = `A highly cinematic, epic movie poster cover for a cyber-novel titled "${novel.title}". Synopsis/Vibe: ${novel.description || (novel.tags ? JSON.parse(novel.tags).join(", ") : "Cyberpunk mystery")}. Ultra-detailed, 8k resolution, stunning lighting, masterpiece, no text.`;
            
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024", // Hero size
                response_format: "url",
            });

            const imageUrl = response.data?.[0]?.url;
            if (!imageUrl) {
                console.warn(`Failed to generate image for ${novel.title}`);
                continue;
            }

            console.log(`📥 Downloading image ...`);
            const imageRes = await fetch(imageUrl);
            const arrayBuffer = await imageRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to R2
            const fileExtension = "png";
            const fileName = `posters/hero_${novel.id}_${crypto.randomBytes(4).toString('hex')}.${fileExtension}`;
            
            console.log(`☁️ Uploading to R2: ${fileName}`);
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: "image/png",
            }));

            const finalUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
            console.log(`✅ Uploaded successfully: ${finalUrl}`);

            // Update Database
            await prisma.novel.update({
                where: { id: novel.id },
                data: {
                    featured: true,
                    coverUrl: finalUrl
                }
            });
            console.log(`💾 DB Updated for ${novel.title}`);

        } catch (error) {
            console.error(`❌ Error processing ${novel.title}:`, error);
        }
    }
    
    console.log("\n🎉 Generation complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
