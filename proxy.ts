import { adminAuth } from "@/app/config/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  let userId: string | null = null;
  if (session) {
    try {
      const decodedToken = await adminAuth.verifySessionCookie(session);
      userId = decodedToken.uid;
    } catch (error) {
      console.error("Error verifying session:", error);
      userId = null;
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Verifica se a rota é pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Se é rota protegida e não tem refresh_token, redireciona para login
  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se é rota pública (login) e tem refresh_token, redireciona para dashboard
  if (isPublicRoute && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
