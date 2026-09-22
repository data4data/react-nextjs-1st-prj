import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A very small session token, on purpose.
 *
 * The token is `payload.signature`. The payload is readable, which is fine: it
 * holds no secret. The signature proves that we made it, because only the
 * server knows AUTH_SECRET. Change one letter of the payload and the signature
 * no longer matches.
 *
 * This is a demo login with one account. A real product would use a library
 * such as Auth.js or Clerk.
 */

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  email: string;
  /** Unix time in seconds. */
  exp: number;
};

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is missing. Copy .env.example to .env.local.");
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createToken(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `${encoded}.${sign(encoded)}`;
}

/** Returns the payload, or null if the token is missing, changed or expired. */
export function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);

  // Compare in constant time so the comparison cannot leak the signature.
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
