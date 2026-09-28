"use client";

import Link from "next/link";
import { Sun, Tent, TreePine, Waves } from "lucide-react";
import { cn } from "cn";

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
  fill = false,
}: {
  header: Site["header"];
  siteSlug: string;
  /**
   * Fill the parent instead of the public page max width. The CMS preview
   * card is already a slice of the site, so `max-w-6xl` would bunch the name
   * and the button in the middle of the card.
   */
  fill?: boolean;
}) {
  const LogoIcon = logoIcons[header.logoIcon];

  return (
    <header
      className={cn(
        "border-b bg-background/90 backdrop-blur",
        fill ? "relative" : "sticky top-0 z-40"
      )}
    >
      <div
        className={cn(
          "flex h-16 w-full items-center justify-between gap-4 px-4",
          fill ? "px-6" : "mx-auto max-w-6xl"
        )}
      >
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
