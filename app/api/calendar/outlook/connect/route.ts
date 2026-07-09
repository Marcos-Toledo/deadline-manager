import { requireAuth } from "@/lib/auth";
import {
    generateCodeChallenge,
    generateCodeVerifier,
    generateOAuthState,
    setOAuthCookies,
} from "@/lib/calendar/oauth-state";
import { getMicrosoftAuthUrl } from "@/lib/calendar/outlook";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const state = generateOAuthState();
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    await setOAuthCookies("outlook", state, verifier, user.uid);
    const url = getMicrosoftAuthUrl(state, challenge);
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
