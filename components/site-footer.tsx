"use client";

import { cn } from "cn";

import type { Site } from "@/lib/cms/types";

/**
 * The footer. The links come from the CMS, so the list can be empty, short or
 * long; it wraps instead of overflowing.
 */
export function SiteFooter({
  footer,
  siteName,
  fill = false,
}: {
  footer: Site["footer"];
  siteName: string;
  /**
   * Fill the parent instead of the public page max width. The CMS preview
   * card is already a slice of the site, so `max-w-6xl` would bunch the
   * address and the links in the middle of the card.
   */
  fill?: boolean;
}) {
  const inner = cn("w-full", fill ? "px-6" : "mx-auto max-w-6xl px-4");

  return (
    <footer className="border-t bg-section-tint">
      <div
        className={cn(
          inner,
          "flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between"
        )}
      >
        <div className="max-w-prose">
          <p className="font-semibold">{siteName}</p>
          <p className="mt-2 text-sm text-pretty text-muted-foreground">{footer.text}</p>
        </div>

        {footer.links.length > 0 ? (
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {footer.links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  {/* A plain anchor: CMS links can point to a section on the
                      page or to another website. */}
                  <a
                    href={link.href}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>

      <div className="border-t">
        <p className={cn(inner, "py-4 text-xs text-muted-foreground")}>
          &copy; {new Date().getFullYear()} {siteName}
        </p>
      </div>
    </footer>
  );
}
