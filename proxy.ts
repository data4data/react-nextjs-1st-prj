import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifyToken } from "@/lib/auth/token";

/**
 * The gate in front of the CMS.
 *
 * In Next 16 this file is called `proxy.ts`; older tutorials call it
 * `middleware.ts`. It runs before the page is rendered, so a visitor without a
 * valid session never reaches /dashboard.
 *
 * This is only a gate. Every server action checks the session again, because a
 * request can be sent straight to an action without passing a page.
 */
export function proxy(request: NextRequest) {
  const session = verifyToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
