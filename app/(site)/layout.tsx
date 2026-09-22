import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSite } from "@/lib/cms/repository";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();

  return {
    title: site.title,
    description: site.description,
  };
}

/**
 * Layout for the public website.
 *
 * `getSite()` is also called by the page below. React caches it per request,
 * so the JSON file is still read only once.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();

  return (
    <ThemeProvider theme={site.theme}>
      <SiteHeader header={site.header} />
      <main className="flex-1">{children}</main>
      <SiteFooter footer={site.footer} siteName={site.title} />
    </ThemeProvider>
  );
}
