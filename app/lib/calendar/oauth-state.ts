import type { CalendarProvider } from "@/app/types";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

const COOKIE_PREFIX = "calendar_oauth";
const MAX_AGE = 60 * 10; // 10 minutos

function cookieName(
  provider: CalendarProvider,
  key: "state" | "verifier" | "uid",
) {
  return `${COOKIE_PREFIX}_${provider}_${key}`;
}

export function generateOAuthState(): string {
  return randomBytes(32).toString("hex");
}

export function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export async function setOAuthCookies(
  provider: CalendarProvider,
  state: string,
  verifier?: string,
  userId?: string,
) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set(cookieName(provider, "state"), state, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  if (verifier) {
    cookieStore.set(cookieName(provider, "verifier"), verifier, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
  }

  if (userId) {
    cookieStore.set(cookieName(provider, "uid"), userId, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
  }
}

export async function consumeOAuthCookies(
  provider: CalendarProvider,
  expectedState: string,
): Promise<{ verifier?: string; userId?: string }> {
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(cookieName(provider, "state"));
  const verifierCookie = cookieStore.get(cookieName(provider, "verifier"));
  const uidCookie = cookieStore.get(cookieName(provider, "uid"));

  if (!stateCookie || stateCookie.value !== expectedState) {
    throw new Error("Invalid OAuth state");
  }

  cookieStore.delete(cookieName(provider, "state"));
  const verifier = verifierCookie?.value;
  if (verifier) {
    cookieStore.delete(cookieName(provider, "verifier"));
  }
  const userId = uidCookie?.value;
  if (userId) {
    cookieStore.delete(cookieName(provider, "uid"));
  }

  return { verifier, userId };
}
