import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Clerk svix signature webhook handler that processes user.created,
 * user.updated, and user.deleted events, delegating database state updates to FastAPI.
 */
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new NextResponse("Error: CLERK_WEBHOOK_SECRET is not configured", { status: 500 });
  }

  // Retrieve svix signature headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error: Missing SVIX verification headers", { status: 400 });
  }

  // Get raw JSON payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify svix cryptographic signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Clerk signature validation error:", err);
    return new NextResponse("Error: Webhook signature is invalid", { status: 400 });
  }

  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  const { id } = evt.data;
  const eventType = evt.type;

  // 1. Sync User Creation or Update
  if (eventType === "user.created" || eventType === "user.updated") {
    const email = evt.data.email_addresses?.[0]?.email_address;
    const firstName = evt.data.first_name || "";
    const lastName = evt.data.last_name || "";
    const name = `${firstName} ${lastName}`.trim() || undefined;

    if (!id || !email) {
      return new NextResponse("Error: Missing user metadata in event payload", { status: 400 });
    }

    const response = await fetch(`${backendUrl}/api/users/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, name }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new NextResponse(`Error syncing user via FastAPI: ${errText}`, { status: 500 });
    }
  }

  // 2. Cascade User Deletion
  if (eventType === "user.deleted") {
    if (!id) {
      return new NextResponse("Error: Missing user identifier", { status: 400 });
    }

    const response = await fetch(`${backendUrl}/api/users/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new NextResponse(`Error deleting user via FastAPI: ${errText}`, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
