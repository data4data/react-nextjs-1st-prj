import type { Metadata } from "next";

import { GeneralEditor } from "@/components/settings/fixed-part-editors";
import { loadSettingsSite } from "@/lib/cms/load-settings-site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}): Promise<Metadata> {
  const { site: slug } = await params;
  const site = await loadSettingsSite(slug);

  return { title: `Algemeen — ${site.title}` };
}

export default async function GeneralSettingsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: slug } = await params;
  const site = await loadSettingsSite(slug);

  return <GeneralEditor initialSite={site} />;
}
