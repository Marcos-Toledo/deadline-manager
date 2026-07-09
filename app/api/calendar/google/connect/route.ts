import { requireAuth } from "@/lib/auth";
import { getGoogleAuthUrl } from "@/lib/calendar/google";
import {
    generateOAuthState,
    setOAuthCookies,
} from "@/lib/calendar/oauth-state";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const state = generateOAuthState();
    await setOAuthCookies("google", state, undefined, user.uid);
    const url = getGoogleAuthUrl(state);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/dashboard?calendar_error=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
  }
}
