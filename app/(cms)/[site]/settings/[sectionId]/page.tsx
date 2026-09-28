import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sectionLabels } from "@/lib/cms/section-labels";
import { SectionPartEditor } from "@/components/settings/section-part-editor";
import { loadSettingsSite } from "@/lib/cms/load-settings-site";
import { isFixedSettingsPath } from "@/lib/cms/settings-paths";

type SectionParams = { params: Promise<{ site: string; sectionId: string }> };

export async function generateMetadata({
  params,
}: SectionParams): Promise<Metadata> {
  const { site: slug, sectionId } = await params;

  if (isFixedSettingsPath(sectionId)) {
    return { title: "Instellingen" };
  }

  const site = await loadSettingsSite(slug);
  const section = site.sections.find((item) => item.id === sectionId);

  return {
    title: section
      ? `${sectionLabels[section.type]} — ${site.title}`
      : "Instellingen",
  };
}

export default async function SectionSettingsPage({ params }: SectionParams) {
  const { site: slug, sectionId } = await params;

  // The fixed pages live in their own folders. This file must not catch them.
  if (isFixedSettingsPath(sectionId)) notFound();

  const site = await loadSettingsSite(slug);
  const section = site.sections.find((item) => item.id === sectionId);

  if (!section) notFound();

  return <SectionPartEditor sectionId={section.id} />;
}
