import type { Metadata } from "next";

import { ColorsEditor } from "@/components/settings/fixed-part-editors";
import { loadSettingsSite } from "@/lib/cms/load-settings-site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}): Promise<Metadata> {
  const { site: slug } = await params;
  const site = await loadSettingsSite(slug);

  return { title: `Kleuren — ${site.title}` };
}

export default async function ColorsSettingsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: slug } = await params;
  const site = await loadSettingsSite(slug);

  return <ColorsEditor initialSite={site} />;
}
