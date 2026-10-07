const SAFE_REDIRECT_ORIGIN = "https://redirect.invalid";

export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback: string,
): string {
  if (
    !candidate?.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return fallback;
  }

  try {
    const resolved = new URL(candidate, SAFE_REDIRECT_ORIGIN);
    if (resolved.origin !== SAFE_REDIRECT_ORIGIN) return fallback;
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
