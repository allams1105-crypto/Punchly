import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();
const hash = bcrypt.hashSync("admin123", 10);

await p.organization.create({
  data: {
    id: "needy",
    name: "Mi Empresa",
    slug: "mi-empresa",
    users: {
      create: {
        id: "admin",
        email: "admin@needy.com",
        name: "Admin",
        role: "OWNER",
        pin: hash,
      }
    }
  }
});

console.log("Listo! Login: admin@needy.com / admin123");
await p.$disconnect();

