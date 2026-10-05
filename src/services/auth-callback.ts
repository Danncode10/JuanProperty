import "server-only";

import type { EmailOtpType } from "@supabase/supabase-js";
import { getSafeRedirectPath } from "@/services/auth-redirect";
import { createClient } from "@/utils/supabase/server";

type AuthCallbackFailure =
  "confirmation_failed" | "oauth_exchange_failed" | "oauth_provider_error";

export function getConfiguredAppOrigin(request: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Fall through to request-derived values when the environment is invalid.
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be configured in production");
  }

  const requestOrigin = new URL(request.url).origin;
  return requestOrigin.includes("0.0.0.0")
    ? "http://localhost:3000"
    : requestOrigin;
}

function buildFailureRedirect(
  appOrigin: string,
  failure: AuthCallbackFailure,
): string {
  const redirectUrl = new URL("/login", appOrigin);
  redirectUrl.searchParams.set("error", failure);
  return redirectUrl.toString();
}

export async function getAuthCallbackRedirect(
  request: Request,
): Promise<string> {
  const requestUrl = new URL(request.url);
  const appOrigin = getConfiguredAppOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const flowId = requestUrl.searchParams.get("sb_flow_id");
  const oauthProvider = requestUrl.searchParams.get("oauth_provider");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const callbackError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");
  const fallbackNext = type === "recovery" ? "/reset-password" : "/login";
  const next = getSafeRedirectPath(
    requestUrl.searchParams.get("next"),
    fallbackNext,
  );

  if (callbackError) {
    console.error("[auth callback] Provider returned an OAuth error", {
      error: callbackError,
    });
    return buildFailureRedirect(
      appOrigin,
      flowId || oauthProvider === "google"
        ? "oauth_provider_error"
        : "confirmation_failed",
    );
  }

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return new URL(next, appOrigin).toString();
    }

    console.error("[auth callback] Email token verification failed", {
      code: error.code,
      status: error.status,
    });
    return buildFailureRedirect(appOrigin, "confirmation_failed");
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );

    if (!error) {
      return new URL(next, appOrigin).toString();
    }

    console.error("[auth callback] OAuth code exchange failed", {
      name: error.name,
      code: error.code,
      status: error.status,
      message: error.message,
    });
    return buildFailureRedirect(appOrigin, "oauth_exchange_failed");
  }

  return buildFailureRedirect(appOrigin, "confirmation_failed");
}
