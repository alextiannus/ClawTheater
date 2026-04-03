const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'alextiannus@gmail.com' }
  });
  
  let userId = user ? user.id : null;
  console.log("User ID:", userId || "Not found");
  
  // Find all skills containing the email or created by this user
  const skills = await prisma.skill.findMany({
    include: {
        creatorUser: true,
        creatorAgent: true
    },
    orderBy: { createdAt: 'asc' }
  });
  
  let mySkills = skills.filter(s => {
      if (s.creatorUser && s.creatorUser.email === 'alextiannus@gmail.com') return true;
      if (s.creatorAgent && s.creatorAgent.email === 'alextiannus@gmail.com') return true;
      if (s.creatorUserId === userId) return true;
      if (s.creatorAgent && s.creatorAgent.ownerId === userId) return true;
      return false;
  });
  
  console.log(`Found ${mySkills.length} skills tied to alextiannus@gmail.com.`);
  
  const seen = new Set();
  const toDelete = [];
  
  for (const skill of mySkills) {
    if (seen.has(skill.name)) {
      toDelete.push(skill.id);
      console.log(`Duplicate found: ${skill.name} (${skill.id})`);
    } else {
      seen.add(skill.name);
    }
  }
  
  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate skills...`);
    await prisma.skill.deleteMany({
      where: { id: { in: toDelete } }
    });
    console.log("Deletion complete.");
  } else {
    console.log("No duplicates found to delete.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
