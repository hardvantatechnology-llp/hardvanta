import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PREFIX = "/admin";

// Auth-gating these routes here (instead of a redirect() deep inside each
// Server Component) means an unauthenticated request gets a real HTTP 307
// before any rendering starts. Doing the same redirect() from inside the
// page forces Next.js to fall back to a client-side <meta http-equiv=
// "refresh" content="1;..."> tag once streaming has begun — a hardcoded
// ~1s delay on every visit to a protected route by a signed-out visitor.
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const unauthenticated = !token;
  const notAdmin = isAdminRoute && token?.role !== "ADMIN";

  if (unauthenticated || notAdmin) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/orders/:path*", "/admin/:path*"],
};
