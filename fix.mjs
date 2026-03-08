import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

await p.organization.update({
  where: { id: "needy" },
  data: { name: "Mi Empresa" }
});

console.log("Listo!");
await p.$disconnect();