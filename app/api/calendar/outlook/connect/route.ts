import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateOAuthState,
  setOAuthCookies,
} from "@/app/lib/calendar/oauth-state";
import { getMicrosoftAuthUrl } from "@/app/lib/calendar/outlook";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const state = generateOAuthState();
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    await setOAuthCookies("outlook", state, verifier);
    const url = getMicrosoftAuthUrl(state, challenge);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/dashboard?calendar_error=${encodeURIComponent(message)}`,
        request.url
      )
    );
  }
}
