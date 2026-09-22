"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { saveSite } from "@/lib/cms/repository";
import { siteSchema } from "@/lib/cms/schema";
import type { ActionResult, Site } from "@/lib/cms/types";

/**
 * Saves the whole site content.
 *
 * `requireUser()` runs first. The gate in `proxy.ts` only protects the page;
 * this action can be called directly, so it has to check for itself.
 */
export async function saveSiteAction(site: Site): Promise<ActionResult> {
  await requireUser();

  const parsed = siteSchema.safeParse(site);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "form";
      errors[field] = [...(errors[field] ?? []), issue.message];
    }

    return { ok: false, message: "De inhoud klopt nog niet.", errors };
  }

  await saveSite(parsed.data);

  // Without this the visitor would keep seeing the old, cached page and the
  // save would look like it did nothing.
  revalidatePath("/");
  revalidatePath("/dashboard");

  return { ok: true, message: "Opgeslagen. De website is bijgewerkt." };
}
