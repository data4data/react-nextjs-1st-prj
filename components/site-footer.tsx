import type { Site } from "@/lib/cms/types";

/**
 * The footer. The links come from the CMS, so the list can be empty, short or
 * long; it wraps instead of overflowing.
 */
export function SiteFooter({ footer, siteName }: { footer: Site["footer"]; siteName: string }) {
  return (
    <footer className="border-t bg-section-tint">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
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
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteName}
        </p>
      </div>
    </footer>
  );
}
