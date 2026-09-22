"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { checkCredentials, createSession, destroySession } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/cms/types";

const loginSchema = z.object({
  email: z.email({ error: "Vul een geldig e-mailadres in" }).trim(),
  password: z.string().min(1, { error: "Vul uw wachtwoord in" }),
});

/**
 * Where to send someone after they log in.
 *
 * The value comes from the URL, so it cannot be trusted: `?next=https://evil`
 * would turn our own login page into a springboard to another website. Only a
 * path on this site is allowed, and `//host` is refused because a browser reads
 * that as a full address.
 */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";

  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function login(
  _previous: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      errors[field] = [...(errors[field] ?? []), issue.message];
    }

    return { ok: false, message: "Controleer de gegevens hieronder.", errors };
  }

  if (!checkCredentials(parsed.data.email, parsed.data.password)) {
    // One message for both cases, so it does not reveal which e-mail exists.
    return { ok: false, message: "Onjuiste combinatie van e-mailadres en wachtwoord." };
  }

  await createSession(parsed.data.email);

  // `redirect` works by throwing, so nothing after this line runs.
  redirect(safeNext(formData.get("next")));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
