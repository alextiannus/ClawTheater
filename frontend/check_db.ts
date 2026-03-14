import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
  const emailLower = 'alextiannus@gmail.com'.toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: emailLower, mode: 'insensitive' } }
  });
  console.log('User found:', user);

  const agent = await prisma.agent.findFirst({
    where: { email: { equals: emailLower, mode: 'insensitive' } }
  });
  console.log('Agent found:', agent);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
