import { adminAuth } from "@/config/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em ms
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  const response = NextResponse.json({ status: "success" });
  response.cookies.set("session", sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.delete("session");
  return response;
}
