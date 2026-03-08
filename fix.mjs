import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const id = "cmmha32md0001remejm8t3dp5"; // Papa

await p.timeEntry.deleteMany({ where: { userId: id } });
await p.activityLog.deleteMany({ where: { userId: id } });
await p.user.delete({ where: { id } });

console.log("Papa eliminado!");
await p.$disconnect();