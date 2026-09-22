import type { Site } from "@/lib/cms/types";

/**
 * Paints the whole site in the colors chosen in the CMS.
 *
 * `app/globals.css` already defines `--primary` and `--secondary`, and Tailwind
 * classes such as `bg-primary` read those variables. Writing new values on this
 * wrapper overrides them for everything inside it, so one input in the CMS can
 * recolor the site without touching a single component.
 */
export function ThemeProvider({
  theme,
  children,
}: {
  theme: Site["theme"];
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={
        {
          "--primary": theme.primary,
          "--secondary": theme.secondary,
          "--ring": theme.primary,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
