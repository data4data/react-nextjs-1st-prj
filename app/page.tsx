import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSites } from "@/lib/cms/repository";

export const metadata = {
  title: "Websites",
  description: "De websites die in dit CMS staan.",
};

/**
 * The front door: every website that lives in this CMS.
 *
 * It sits outside the (site) and (cms) route groups on purpose, so it carries
 * neither a park's header and footer nor the beheer bar.
 */
export default async function SitesPage() {
  const sites = await listSites();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:py-20">
      <h1 className="text-2xl font-semibold sm:text-3xl">Websites in dit CMS</h1>
      <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
        Twee parken, dezelfde code. Alles wat verschilt staat in een JSON-bestand
        onder <code className="text-sm">data/sites/</code>: de teksten, de kleuren
        en de volgorde van de secties.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sites.map((site) => (
          <Card key={site.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-4 shrink-0 rounded-full border"
                  style={{ background: site.theme.primary }}
                />
                <span
                  aria-hidden
                  className="size-4 shrink-0 rounded-full border"
                  style={{ background: site.theme.secondary }}
                />
              </div>
              <CardTitle className="mt-2 text-pretty">{site.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-6">
              <p className="text-sm text-pretty text-muted-foreground">
                {site.description}
              </p>

              {/* Links, not buttons: they navigate. `buttonVariants` gives them
                  the look of a button without pretending to be one. */}
              <div className="flex flex-wrap gap-2">
                <Link href={`/${site.slug}`} className={buttonVariants({ size: "sm" })}>
                  Bekijk website
                </Link>
                <Link
                  href={`/${site.slug}/settings`}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Instellingen
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
