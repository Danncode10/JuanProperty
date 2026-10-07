import { NextResponse } from "next/server";
import { getConfiguredAppOrigin } from "@/services/auth-callback";
import { getGoogleOAuthAuthorizationUrl } from "@/services/auth-oauth-server";

export async function GET(request: Request) {
  try {
    return NextResponse.redirect(await getGoogleOAuthAuthorizationUrl(request));
  } catch (error: unknown) {
    console.error("[auth oauth] Could not start Google OAuth", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    const loginUrl = new URL("/login", getConfiguredAppOrigin(request));
    loginUrl.searchParams.set("error", "oauth_provider_error");
    return NextResponse.redirect(loginUrl);
  }
}
