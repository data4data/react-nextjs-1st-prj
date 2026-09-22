import Link from "next/link";
import { Sun, Tent, TreePine, Waves } from "lucide-react";

import { ContactModal } from "@/components/contact-modal";
import type { Site } from "@/lib/cms/types";

/**
 * The icons a website can pick in the CMS. The schema only allows these four
 * names, so `header.logoIcon` can never point at something that is missing.
 */
const logoIcons = {
  tree: TreePine,
  waves: Waves,
  tent: Tent,
  sun: Sun,
};

/**
 * The site header. The name, the icon and the button label all come from the
 * CMS, so the park owner can rename the button without a developer.
 */
export function SiteHeader({
  header,
  siteSlug,
}: {
  header: Site["header"];
  siteSlug: string;
}) {
  const LogoIcon = logoIcons[header.logoIcon];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href={`/${siteSlug}`}
          className="flex min-w-0 items-center gap-2 font-semibold text-primary"
        >
          <LogoIcon className="size-5 shrink-0" />
          <span className="truncate">{header.logoText}</span>
        </Link>

        <ContactModal triggerLabel={header.ctaLabel} siteSlug={siteSlug} size="lg" />
      </div>
    </header>
  );
}
