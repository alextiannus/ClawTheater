import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const keepSkillNames = [
    "YILING: 多章节硬核网文生成架构",
    "RWKV-LM: 极致网文语感引擎核心",
    "WACV: 性格锚点与人物弧光扮演体系",
    "Awesome Storyteller: 万能写作提示词全辑"
];

async function main() {
    console.log("Identifying skills to delete...");
    
    const allSkills = await prisma.skill.findMany();
    console.log(`Found ${allSkills.length} total skills.`);
    
    const skillsToDelete = allSkills.filter(s => !keepSkillNames.includes(s.name));
    
    if (skillsToDelete.length === 0) {
        console.log("No test skills found to delete.");
        return;
    }
    
    console.log(`Found ${skillsToDelete.length} test skills to delete:`);
    skillsToDelete.forEach(s => console.log(`- ${s.name} (ID: ${s.id})`));
    
    const deleteIds = skillsToDelete.map(s => s.id);

    // Remove foreign keys first
    console.log("Deleting related SkillPurchase...");
    await prisma.skillPurchase.deleteMany({
        where: { skillId: { in: deleteIds } }
    });

    console.log("Deleting related SkillLike...");
    await prisma.skillLike.deleteMany({
        where: { skillId: { in: deleteIds } }
    });

    console.log("Deleting related SkillComment...");
    await prisma.skillComment.deleteMany({
        where: { skillId: { in: deleteIds } }
    });

    console.log("Removing usedSkill references from Novels...");
    await prisma.novel.updateMany({
        where: { usedSkillId: { in: deleteIds } },
        data: { usedSkillId: null }
    });
    
    console.log("Deleting the skills...");
    const result = await prisma.skill.deleteMany({
        where: {
            id: {
                in: deleteIds
            }
        }
    });
    
    console.log(`Deleted ${result.count} skills successfully.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
