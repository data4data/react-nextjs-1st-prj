import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createToken,
  verifyToken,
} from "@/lib/auth/token";

export type User = { email: string };

/**
 * Checks the email and password against the single demo account in .env.local.
 */
export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.DEMO_EMAIL;
  const expectedPassword = process.env.DEMO_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    throw new Error("DEMO_EMAIL or DEMO_PASSWORD is missing. Copy .env.example to .env.local.");
  }

  return email.toLowerCase() === expectedEmail.toLowerCase() && password === expectedPassword;
}

export async function createSession(email: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, createToken(email), {
    // The browser cannot read this cookie from JavaScript.
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** The logged-in user, or null. Safe to call anywhere on the server. */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const payload = verifyToken(cookieStore.get(SESSION_COOKIE)?.value);

  return payload ? { email: payload.email } : null;
}

/**
 * Use this inside every server action that changes something.
 *
 * The check in `proxy.ts` only guards the page. Someone can still call an
 * action directly, so the action has to ask again.
 */
export async function requireUser(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
