"use server";

import { contactMessageSchema } from "@/lib/cms/schema";
import { addMessage } from "@/lib/cms/repository";
import type { ActionResult } from "@/lib/cms/types";

/**
 * Runs on the server, even though the form in the browser calls it directly.
 *
 * Never trust what arrives here: the browser can send anything, so the data is
 * validated again before it is stored.
 */
export async function submitContact(
  _previous: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      errors[field] = [...(errors[field] ?? []), issue.message];
    }

    return {
      ok: false,
      message: "Controleer de gegevens hieronder.",
      errors,
    };
  }

  await addMessage(parsed.data);

  return {
    ok: true,
    message: "Bedankt voor uw bericht. We reageren binnen een werkdag.",
  };
}
