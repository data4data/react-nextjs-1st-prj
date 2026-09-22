import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSite } from "@/lib/cms/repository";

export async function generateMetadata({
  params,
}: LayoutProps<"/[site]">): Promise<Metadata> {
  const { site: slug } = await params;
  const site = await getSite(slug);

  if (!site) return {};

  return {
    title: site.title,
    description: site.description,
  };
}

/**
 * Layout for one public website.
 *
 * Everything that differs per website lives here: the colors, the header and
 * the footer. The slug in the folder name `[site]` is what picks which one, so
 * a third website is a third JSON file and no new code.
 *
 * `getSite()` is also called by the page below. React caches it per request,
 * so the JSON file is still read only once.
 */
export default async function SiteLayout({ children, params }: LayoutProps<"/[site]">) {
  const { site: slug } = await params;
  const site = await getSite(slug);

  if (!site) notFound();

  return (
    <ThemeProvider theme={site.theme}>
      <SiteHeader header={site.header} siteSlug={site.slug} />
      <main className="flex-1">{children}</main>
      <SiteFooter footer={site.footer} siteName={site.title} />
    </ThemeProvider>
  );
}
