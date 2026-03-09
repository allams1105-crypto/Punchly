import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:admin@punchlyclock.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  const { userId, title, body, url, urgent } = await req.json();

  const subs = userId
    ? await prisma.pushSubscription.findMany({ where: { userId } })
    : await prisma.pushSubscription.findMany();

  const results = await Promise.allSettled(
    subs.map(s =>
      webpush.sendNotification(JSON.parse(s.subscription), JSON.stringify({ title, body, url, urgent }))
    )
  );

  return NextResponse.json({ sent: results.filter(r => r.status === "fulfilled").length });
}