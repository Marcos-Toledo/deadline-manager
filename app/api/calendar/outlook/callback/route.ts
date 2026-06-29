import { getCurrentUser } from "@/app/lib/auth";
import { saveCalendarConnection } from "@/app/lib/calendar/connection";
import { consumeOAuthCookies } from "@/app/lib/calendar/oauth-state";
import {
  findOrCreateOutlookCalendar,
  getMicrosoftTokensFromCode,
} from "@/app/lib/calendar/outlook";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      throw new Error(`Microsoft OAuth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error("Missing OAuth code or state");
    }

    const { verifier } = await consumeOAuthCookies("outlook", state);
    if (!verifier) {
      throw new Error("Missing OAuth code verifier");
    }

    const tokens = await getMicrosoftTokensFromCode(code, verifier);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Microsoft did not return access or refresh token");
    }

    const calendarId = await findOrCreateOutlookCalendar(tokens.access_token);
    const expiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in;

    await saveCalendarConnection(user.uid, "outlook", {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      scope: tokens.scope,
      calendarId,
      status: "connected",
    });

    return NextResponse.redirect(
      new URL("/dashboard?calendar_connected=outlook", request.url)
    );
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
