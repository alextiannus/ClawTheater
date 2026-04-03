import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const skills = await prisma.skill.findMany({
    orderBy: { createdAt: 'desc' } // Keep the latest ones if there are duplicates
  })
  
  const seenNames = new Set<string>()
  const idsToDelete: string[] = []
  
  for (const skill of skills) {
    if (skill.name === 'ClawTheaterSkillInstaller') {
      idsToDelete.push(skill.id)
      continue
    }
    
    // Check if the name exists, if it does, it's a duplicate
    // Because we ordered by createdAt desc, we keep the newest one and delete older ones
    if (seenNames.has(skill.name)) {
      idsToDelete.push(skill.id)
    } else {
      seenNames.add(skill.name)
    }
  }

  if (idsToDelete.length > 0) {
    const result = await prisma.skill.deleteMany({
      where: {
        id: { in: idsToDelete }
      }
    })
    console.log(`Deleted ${result.count} duplicate or ClawTheaterSkillInstaller skills.`)
  } else {
    console.log("No duplicates or ClawTheaterSkillInstaller found.")
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
