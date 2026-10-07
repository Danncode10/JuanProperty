import "server-only";

import { getConfiguredAppOrigin } from "@/services/auth-callback";
import { getSafeRedirectPath } from "@/services/auth-redirect";
import { createClient } from "@/utils/supabase/server";

export async function getGoogleOAuthAuthorizationUrl(
  request: Request,
): Promise<string> {
  const requestUrl = new URL(request.url);
  const appOrigin = getConfiguredAppOrigin(request);
  const next = getSafeRedirectPath(
    requestUrl.searchParams.get("next"),
    "/dashboard",
  );
  const callbackUrl = new URL("/auth/callback", appOrigin);
  callbackUrl.searchParams.set("next", next);
  callbackUrl.searchParams.set("oauth_provider", "google");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("Supabase did not return an OAuth URL");

  const authorizationUrl = new URL(data.url);
  const redirectTo = authorizationUrl.searchParams.get("redirect_to");

  if (!data.flowId || !redirectTo) {
    throw new Error("Supabase did not return the OAuth PKCE flow metadata");
  }

  // Supabase stores a separate verifier for every PKCE flow. Carry the flow
  // identifier through the hosted provider callback so the app exchanges the
  // authorization code with the verifier created for this exact sign-in.
  const correlatedCallbackUrl = new URL(redirectTo);
  correlatedCallbackUrl.searchParams.set("sb_flow_id", data.flowId);
  authorizationUrl.searchParams.set(
    "redirect_to",
    correlatedCallbackUrl.toString(),
  );

  return authorizationUrl.toString();
}
