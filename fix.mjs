import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const p = new PrismaClient();

const hash = await bcrypt.hash("Admin123!", 10);
await p.user.update({
  where: { id: "admin" },
  data: { 
    email: "allams1105@gmail.com",
    pin: hash,
    name: "Admin"
  }
});

console.log("Listo!");
await p.$disconnect();