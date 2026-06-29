import { NextResponse } from "next/server";

/**
 * Next.js internal API proxy route that receives user sync requests from
 * the frontend action and forwards them securely to the Python FastAPI backend.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email, name } = body;

    if (!id || !email) {
      return new NextResponse("Missing required fields: 'id' and 'email' are mandatory", { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    
    // Forward transaction request to FastAPI service which has DSQL connectivity
    const response = await fetch(`${backendUrl}/api/users/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email, name }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(`FastAPI backend sync failure: ${errorText}`, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error in Next.js sync-user proxy gateway:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error Proxying Sync";
    return new NextResponse(errorMessage, { status: 500 });
  }
}
