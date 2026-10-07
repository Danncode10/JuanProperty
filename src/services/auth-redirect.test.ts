import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "./auth-redirect";

describe("getSafeRedirectPath", () => {
  it("keeps local paths and their query or fragment", () => {
    expect(getSafeRedirectPath("/dashboard?tab=team#member", "/login")).toBe(
      "/dashboard?tab=team#member",
    );
  });

  it.each([
    null,
    "",
    "dashboard",
    "//evil.example",
    "/\\evil.example",
    "https://evil.example",
  ])("rejects unsafe redirect candidate %s", (candidate) => {
    expect(getSafeRedirectPath(candidate, "/login")).toBe("/login");
  });
});
