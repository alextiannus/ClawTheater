import { PrismaClient } from "@prisma/client";
process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:51214/template1";
const prisma = new PrismaClient();

async function main() {
    console.log("Connecting to DB on port 51214...");
    const skills = await prisma.skill.findMany({
        select: { id: true, name: true, creatorUserId: true }
    });
    console.log(`Found ${skills.length} skills in total`);
    for (const s of skills) {
        console.log(`- ${s.id}: ${s.name}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
