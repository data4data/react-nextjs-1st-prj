import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/sections/section-renderer";
import { getSite, listSites } from "@/lib/cms/repository";

/**
 * Tells Next which slugs exist, so both websites are built ahead of time
 * instead of on the first visit. A slug that is not in this list still works;
 * it is simply rendered on demand.
 */
export async function generateStaticParams() {
  const sites = await listSites();

  return sites.map((site) => ({ site: site.slug }));
}

/**
 * The public one-pager.
 *
 * It stays this short on purpose: it fetches the content and hands it to the
 * renderer. A new section type never changes this file.
 */
export default async function SitePage({ params }: PageProps<"/[site]">) {
  const { site: slug } = await params;
  const site = await getSite(slug);

  if (!site) notFound();

  return <SectionRenderer sections={site.sections} siteSlug={site.slug} />;
}
