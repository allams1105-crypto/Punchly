import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Falta la firma de Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Error en Webhook: ${err.message}`);
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.organizationId;

    if (orgId) {
      // De acuerdo a tu schema.prisma, usamos el modelo Subscription
      await prisma.subscription.upsert({
        where: { organizationId: orgId },
        update: { 
          status: "ACTIVE", 
          tier: "PRO",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        },
        create: { 
          organizationId: orgId, 
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          status: "ACTIVE",
          tier: "PRO",
          employeeLimit: 25 // O el límite que quieras para PRO
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}