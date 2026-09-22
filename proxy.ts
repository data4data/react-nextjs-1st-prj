import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifyToken } from "@/lib/auth/token";

/**
 * The gate in front of the CMS.
 *
 * In Next 16 this file is called `proxy.ts`; older tutorials call it
 * `middleware.ts`. It runs before the page is rendered, so a visitor without a
 * valid session never reaches a settings screen.
 *
 * This is only a gate. Every server action checks the session again, because a
 * request can be sent straight to an action without passing a page.
 */
export function proxy(request: NextRequest) {
  const session = verifyToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    // Remember where they were going, so logging in does not dump them on a
    // random page. The login action reads this back.
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // One settings screen per website: /veluwse-hei/settings, /zeeduin/settings.
  matcher: ["/:site/settings/:path*"],
};
