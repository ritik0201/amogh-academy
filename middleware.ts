import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin Route Protection
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Teacher Route Protection
    if (path.startsWith("/teacher") && token?.role !== "teacher") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Student Route Protection
    if (path.startsWith("/student") && token?.role !== "student") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
  ],
};
