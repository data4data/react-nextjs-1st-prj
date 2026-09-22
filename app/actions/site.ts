"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { saveSite } from "@/lib/cms/repository";
import { siteSchema } from "@/lib/cms/schema";
import type { ActionResult, Site } from "@/lib/cms/types";

/**
 * Saves the content of one website.
 *
 * `requireUser()` runs first. The gate in `proxy.ts` only protects the page;
 * this action can be called directly, so it has to check for itself.
 */
export async function saveSiteAction(slug: string, site: Site): Promise<ActionResult> {
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

  await saveSite(slug, parsed.data);

  // Without this the visitor would keep seeing the old, cached page and the
  // save would look like it did nothing. Only this website is rebuilt; the
  // other one in the CMS is untouched.
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/settings`);
  // The index page shows the title and the colors, so it goes stale too.
  revalidatePath("/");

  return { ok: true, message: "Opgeslagen. De website is bijgewerkt." };
}
