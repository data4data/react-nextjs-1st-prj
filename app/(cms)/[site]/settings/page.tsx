import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteEditor } from "@/components/settings/site-editor";
import { requireUser } from "@/lib/auth/session";
import { getSite } from "@/lib/cms/repository";

export async function generateMetadata({
  params,
}: PageProps<"/[site]/settings">): Promise<Metadata> {
  const { site: slug } = await params;
  const site = await getSite(slug);

  return { title: site ? `Instellingen — ${site.title}` : "Instellingen" };
}

/** The edit screen for one website. */
export default async function SettingsPage({ params }: PageProps<"/[site]/settings">) {
  // proxy.ts already blocked anonymous visitors; this makes the page itself
  // safe too, no matter how it is reached.
  await requireUser();

  const { site: slug } = await params;
  const site = await getSite(slug);

  if (!site) notFound();

  return <SiteEditor initialSite={site} />;
}
