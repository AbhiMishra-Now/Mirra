import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe instance (secret key is securely configured server-side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder_stripe_secret", {
  apiVersion: "2026-06-24.dahlia",
});

/**
 * Stripe webhook listener that processes payment completion events and upgrades 
 * user subscription status inside Aurora DSQL via FastAPI connection client.
 */
export async function POST(req: Request) {
  const body = await req.text(); // Raw body string required for webhook verification
  const signature = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("Error: STRIPE_WEBHOOK_SECRET is not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown verification error";
    console.error(`Stripe verification failure: ${errMsg}`);
    return new NextResponse(`Webhook Signature Verification Error: ${errMsg}`, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";

  // 1. Subscription Upgrade Checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve Clerk User ID from client_reference_id or session metadata
    const userId = session.client_reference_id || session.metadata?.userId;
    
    if (!userId) {
      console.warn("Stripe Checkout Warning: No User identifier mapped in Checkout Session.");
      return new NextResponse("Success (No Action): Missing client reference metadata", { status: 200 });
    }

    // Call Python backend to process DSQL subscription upgrade
    const response = await fetch(`${backendUrl}/api/users/upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, tier: "PRO" }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new NextResponse(`Error applying user upgrade on backend: ${errText}`, { status: 500 });
    }
  }

  // 2. Subscription Downgraded / Cancelled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;

    if (userId) {
      const response = await fetch(`${backendUrl}/api/users/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, tier: "FREE" }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new NextResponse(`Error applying user downgrade on backend: ${errText}`, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
