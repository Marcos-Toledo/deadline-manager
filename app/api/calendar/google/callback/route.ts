import { getCurrentUser } from "@/lib/auth";
import { saveCalendarConnection } from "@/lib/calendar/connection";
import {
    findOrCreateGoogleCalendar,
    getGoogleTokensFromCode,
} from "@/lib/calendar/google";
import { consumeOAuthCookies } from "@/lib/calendar/oauth-state";
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
      throw new Error(`Google OAuth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error("Missing OAuth code or state");
    }

    const { userId } = await consumeOAuthCookies("google", state);
    if (userId && userId !== user.uid) {
      throw new Error(
        "Session mismatch: o usuário que iniciou a conexão é diferente do usuário atual",
      );
    }
    const tokens = await getGoogleTokensFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Google did not return access or refresh token");
    }

    const calendarId = await findOrCreateGoogleCalendar(tokens.access_token);
    const expiresAt = tokens.expiry_date
      ? Math.floor(tokens.expiry_date / 1000)
      : Math.floor(Date.now() / 1000) + 3600;

    await saveCalendarConnection(user.uid, "google", {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      scope: tokens.scope ?? "https://www.googleapis.com/auth/calendar",
      calendarId,
      status: "connected",
    });

    return NextResponse.redirect(
      new URL("/dashboard?calendar_connected=google", request.url),
    );
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
