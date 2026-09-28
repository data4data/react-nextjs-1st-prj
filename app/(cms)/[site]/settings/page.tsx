import { redirect } from "next/navigation";

import { loadSettingsSite } from "@/lib/cms/load-settings-site";

/**
 * `/veluwse-hei/settings` has no form of its own. It sends you to Algemeen.
 */
export default async function SettingsIndexPage({
  params,
}: PageProps<"/[site]/settings">) {
  const { site: slug } = await params;
  await loadSettingsSite(slug);
  redirect(`/${slug}/settings/general`);
}
