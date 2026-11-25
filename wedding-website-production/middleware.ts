import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Runs before every request. If COMING_SOON is on and we're not on staging,
// rewrite all traffic to /coming-soon. This keeps the host-header check out
// of the layout so pages can stay static and cacheable.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const comingSoon = process.env.COMING_SOON === "true" && !host.startsWith("staging.");

  if (!comingSoon || request.nextUrl.pathname.startsWith("/coming-soon")) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: [
    // Skip Next.js internals, static assets, and API routes
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)",
  ],
};
