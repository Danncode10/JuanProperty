import { NextResponse } from "next/server";
import { getAuthCallbackRedirect } from "@/services/auth-callback";

export async function GET(request: Request) {
  return NextResponse.redirect(await getAuthCallbackRedirect(request));
}
