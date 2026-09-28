import { redirect } from "next/navigation";

import { loadSettingsSite } from "@/lib/cms/load-settings-site";

/**
 * Kleuren used to be its own page. Name and colours now live together under
 * Algemeen, so old bookmarks still land on the combined form.
 */
export default async function ColorsSettingsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: slug } = await params;
  await loadSettingsSite(slug);
  redirect(`/${slug}/settings/general`);
}
