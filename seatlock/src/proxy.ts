import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/student",
  "/organizer",
  "/admin",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get("seatlock_session");

  if (!session?.value) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/organizer/:path*",
    "/admin/:path*",
  ],
};