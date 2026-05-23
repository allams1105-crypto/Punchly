const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: 'cmph5osmy000710gkm62xgmvr' },
    include: { timeEntries: true }
  });
  
  console.dir(user.timeEntries, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
