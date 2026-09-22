import Link from "next/link";
import { TreePine } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Site } from "@/lib/cms/types";

/**
 * The site header. Both the name and the button label come from the CMS, so
 * the park owner can rename the button without a developer.
 */
export function SiteHeader({ header }: { header: Site["header"] }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold text-primary"
        >
          <TreePine className="size-5 shrink-0" />
          <span className="truncate">{header.logoText}</span>
        </Link>

        <Button size="lg" render={<a href="#contact" />}>
          {header.ctaLabel}
        </Button>
      </div>
    </header>
  );
}
