import { writeFileSync, mkdirSync } from "fs";

const signout = `import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await signOut({ redirect: false });
  return NextResponse.redirect(new URL("/en", process.env.NEXTAUTH_URL || "https://punchlyclock.vercel.app"));
}`;

const root = `import { redirect } from "next/navigation";
export default function RootPage() {
  redirect("/en");
}`;

mkdirSync("src/app/api/auth/signout", { recursive: true });
writeFileSync("src/app/api/auth/signout/route.ts", signout);
writeFileSync("src/app/page.tsx", root);
console.log("Listo!");

