import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// Ensure required environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY. Please provide it in .env.local.");
    process.exit(1);
}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const accountId = process.env.CF_ACCOUNT_ID;
const accessKeyId = process.env.CF_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CF_R2_BUCKET_NAME || 'clawtheater-media';
const publicUrl = process.env.CF_R2_PUBLIC_URL || 'https://pub-24aa9fa7803443b3a071fe2b7b178088.r2.dev';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("❌ Missing Cloudflare R2 credentials (CF_ACCOUNT_ID, CF_R2_ACCESS_KEY_ID, CF_R2_SECRET_ACCESS_KEY).");
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function deleteNovelCascading(novelId: string) {
    const chapters = await prisma.chapter.findMany({ where: { novelId } });
    const chapterIds = chapters.map(c => c.id);

    if (chapterIds.length > 0) {
        await prisma.tip.deleteMany({ where: { chapterId: { in: chapterIds } } });
    }
    
    const bounties = await prisma.bounty.findMany({ where: { novelId } });
    const bountyIds = bounties.map(b => b.id);
    
    if (bountyIds.length > 0) {
        await prisma.funding.deleteMany({ where: { bountyId: { in: bountyIds } }});
        
        const works = await prisma.work.findMany({ where: { bountyId: { in: bountyIds } }});
        const workIds = works.map(w => w.id);
        
        if (workIds.length > 0) {
            await prisma.vote.deleteMany({ where: { workId: { in: workIds } }});
            await prisma.work.deleteMany({ where: { id: { in: workIds } }});
        }
        
        await prisma.vote.deleteMany({ where: { bountyId: { in: bountyIds } }});
        await prisma.bounty.deleteMany({ where: { id: { in: bountyIds } }});
    }
    
    await prisma.fork.deleteMany({ where: { novelId } });
    await prisma.chapter.deleteMany({ where: { novelId } });
    await prisma.novel.delete({ where: { id: novelId } });
}

async function uploadImageToR2(imageUrl: string, novelId: string): Promise<string> {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Failed to fetch DALL-E image: ${res.statusText}`);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fileName = `covers/novel_${novelId}_${Date.now()}.png`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/png',
    }));
    
    return `${publicUrl}/${fileName}`;
}

async function main() {
    try {
        console.log("🧹 1. Cleaning up duplicate novels and testing data...");
        // 1. Delete cmmvwy2ko001pw12fxj6glyc8
        const targetId = 'cmmvwy2ko001pw12fxj6glyc8';
        const specificNovel = await prisma.novel.findUnique({ where: { id: targetId } });
        if (specificNovel) {
            await deleteNovelCascading(targetId);
            console.log(`✅ Deleted specific novel '${targetId}'`);
        } else {
            console.log(`⚠️ Novel '${targetId}' already deleted or not found.`);
        }

        // 2. Delete all novels with "测试"
        const testNovels = await prisma.novel.findMany({
            where: { title: { contains: "测试" } }
        });
        for (const n of testNovels) {
            await deleteNovelCascading(n.id);
            console.log(`✅ Deleted test novel '${n.title}' (${n.id})`);
        }

        console.log("-----------------------------------------");
        console.log("🎨 2. Checking remaining novels for missing covers...");

        // 3. Find missing covers
        const allNovels = await prisma.novel.findMany({
            where: { status: { not: "PAUSED" } }
        });

        const missingCoverNovels = allNovels.filter(n => 
            !n.coverUrl || 
            n.coverUrl.trim() === "" || 
            n.coverUrl.includes("example.com") || 
            n.coverUrl.includes("placeholder")
        );

        console.log(`Found ${missingCoverNovels.length} novels needing covers.`);

        // 4. Generate & Upload
        for (const n of missingCoverNovels) {
            console.log(`\n⏳ Generating cover for: "${n.title}"...`);
            
            const prompt = `A highly detailed, cinematic, and captivating cover art for a novel titled "${n.title}". The story description is: "${n.description || 'A fascinating and highly imaginative web novel set in a compelling universe.'}". The art should have no text on it, be visually stunning, vibrant, and perfectly encapsulate the essence of this novel.`;
            
            try {
                const response = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024",
                });
                
                const imageUrl = response.data?.[0]?.url;
                if (!imageUrl) throw new Error("No image URL returned by OpenAI");
                
                console.log(`🌐 Uploading to Cloudflare R2...`);
                const r2Url = await uploadImageToR2(imageUrl, n.id);
                
                console.log(`☁️ Saving ${r2Url} to database...`);
                await prisma.novel.update({
                    where: { id: n.id },
                    data: { coverUrl: r2Url }
                });
                
                console.log(`🎉 Successfully designed and saved cover for "${n.title}"!`);
            } catch (err: any) {
                console.error(`❌ Failed to design cover for "${n.title}":`, err.message);
            }
        }
        
        console.log("\n🚀 All tasks completed successfully.");

    } catch (e) {
        console.error("Unhandled error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
