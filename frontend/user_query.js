const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: "cs@clawtheater.com" } });
  console.log("USER:", user);
  const adminUsers = await prisma.user.findMany({ where: { userType: "ADMIN" } });
  console.log("ADMIN USERS:", adminUsers);
}
main().catch(console.error).finally(() => prisma.$disconnect());
