import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const accountId = process.env.CF_ACCOUNT_ID;
const accessKeyId = process.env.CF_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CF_R2_BUCKET_NAME || 'clawtheater-media';
const publicUrl = process.env.CF_R2_PUBLIC_URL || 'https://pub-24aa9fa7803443b3a071fe2b7b178088.r2.dev';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Missing R2 credentials in environment variables.");
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: ts-node upload-cover.ts <path-to-image>");
    process.exit(1);
  }

  if (!existsSync(filePath)) {
    console.error("File does not exist:", filePath);
    process.exit(1);
  }

  const fileContent = readFileSync(filePath);
  const ext = extname(filePath).toLowerCase();
  
  // Create a unique file name
  const fileName = `covers/ct_${Date.now()}_${Math.random().toString(36).substring(7)}${ext || '.webp'}`;
  
  let contentType = 'image/webp';
  if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: contentType,
    }));
    const fullUrl = `${publicUrl}/${fileName}`;
    console.log(fullUrl);
  } catch (err) {
    console.error("Error uploading to R2:", err);
    process.exit(1);
  }
}

main();
