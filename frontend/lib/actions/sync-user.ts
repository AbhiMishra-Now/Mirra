"use server";

export interface SyncUserData {
  id: string;
  email: string;
  name?: string;
}

/**
 * Server Action that triggers onboarding synchronization by calling 
 * our internal Next.js proxy route, which delegates to the Python backend.
 */
export async function syncUser(userData: SyncUserData) {
  try {
    // Dynamically resolve application URL or default to localhost
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${appUrl}/api/sync-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sync proxy error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sync user onboarding:", error);
    throw error;
  }
}
