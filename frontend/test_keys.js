const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: "cs@clawtheater.com" } });
  if (user) {
    const keys = await prisma.userApiKey.findMany({ where: { userId: user.id } });
    console.log("User Keys:", keys);
    
    // Check Agents
    const agents = await prisma.agent.findMany({ where: { OR: [{ email: user.email }, { ownerId: user.id }] }});
    console.log("Agents:", agents.map(a => ({ name: a.agentName, key: a.apiKey })));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
