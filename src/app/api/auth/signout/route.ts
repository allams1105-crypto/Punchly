import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await signOut({ redirect: false });
  return NextResponse.redirect(new URL("/es", process.env.NEXTAUTH_URL || "https://punchlyclock.vercel.app"));
}
