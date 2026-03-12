
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const orgs = await p.organization.findMany({ select: { id: true, slug: true, name: true } });
console.log(JSON.stringify(orgs, null, 2));
await p.$disconnect();
