import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { getSite } from "@/lib/cms/repository";
import type { Site } from "@/lib/cms/types";

/** Load one website for a settings page. Missing parks become a 404. */
export async function loadSettingsSite(slug: string): Promise<Site> {
  await requireUser();
  const site = await getSite(slug);

  if (!site) notFound();

  return site;
}
