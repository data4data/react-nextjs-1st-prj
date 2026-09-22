import { SectionRenderer } from "@/components/sections/section-renderer";
import { getSite } from "@/lib/cms/repository";

/**
 * The public one-pager.
 *
 * It stays this short on purpose: it fetches the content and hands it to the
 * renderer. A new section type never changes this file.
 */
export default async function HomePage() {
  const site = await getSite();

  return <SectionRenderer sections={site.sections} />;
}
