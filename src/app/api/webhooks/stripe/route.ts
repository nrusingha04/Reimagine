import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Fallback lookup when metadata.userId is missing
 */
async function resolveUserIdFromCustomer(customerId: string) {
  const user = await prisma.users.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("❌ Stripe signature mismatch", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      default:
        console.log("⚠️ Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler failure:", err);
    return NextResponse.json({ error: "Webhook crashed" }, { status: 500 });
  }
}

/**
 * Handles checkout.session.completed
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  let userId = session.metadata?.userId;

  if (!userId && session.customer) {
    userId = await resolveUserIdFromCustomer(session.customer as string);
  }

  if (!userId) {
    console.log("⚠️ No matching user for checkout session");
    return;
  }

  await prisma.users.update({
    where: { id: userId },
    data: {
      plan: "Paid",
      usageLimit: 999999,
      stripeCustomerId: session.customer as string,
    },
  });

  console.log("✔ User upgraded to Paid:", userId);
}

/**
 * Handles subscription.new
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  let userId = subscription.metadata?.userId;

  if (!userId) {
    userId = await resolveUserIdFromCustomer(subscription.customer as string);
  }

  if (!userId) return;

  await prisma.subscriptions.create({
    data: {
      userId: userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
    },
  });

  console.log("📌 Subscription stored:", subscription.id);
}

/**
 * Handles subscription status changes (renewal, cancel, unpaid, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  let userId = subscription.metadata?.userId;

  if (!userId) {
    userId = await resolveUserIdFromCustomer(subscription.customer as string);
  }

  if (!userId) return;

  const active = subscription.status === "active";

  await prisma.users.update({
    where: { id: userId },
    data: {
      plan: active ? "Paid" : "Free",
      usageLimit: active ? 999999 : 3,
    },
  });

  console.log(
    `✔ Subscription updated — user ${
      active ? "upgraded" : "downgraded"
    }:`,
    userId
  );
}

/**
 * Handles subscription deletion (user cancelled)
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  let userId = subscription.metadata?.userId;

  if (!userId) {
    userId = await resolveUserIdFromCustomer(subscription.customer as string);
  }

  if (!userId) return;

  await prisma.users.update({
    where: { id: userId },
    data: {
      plan: "Free",
      usageLimit: 3,
    },
  });

  await prisma.subscriptions.deleteMany({
    where: { stripeSubscriptionId: subscription.id },
  });

  console.log("❌ Subscription canceled — user downgraded:", userId);
}
