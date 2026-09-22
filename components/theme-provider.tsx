import type { Site } from "@/lib/cms/types";

/**
 * Paints the whole site in the colors chosen in the CMS.
 *
 * `app/globals.css` already defines `--primary`, `--secondary` and friends, and
 * Tailwind classes such as `bg-primary` read those variables. Writing new
 * values here overrides them, so one input in the CMS can recolor the site
 * without touching a single component.
 *
 * The values are written on `:root` instead of on a wrapper element on purpose.
 * A CSS variable is inherited by children, and the contact modal is *not* a
 * child: Radix renders it through a portal, straight into `<body>`. On a
 * wrapper the modal would miss the colors and fall back to the defaults. The
 * same goes for the toasts, which live in the root layout.
 *
 * Putting the rule in a `<style>` tag is safe because the schema only accepts
 * `#rrggbb`, so nothing else can end up in the CSS.
 */
export function ThemeProvider({
  theme,
  children,
}: {
  theme: Site["theme"];
  children: React.ReactNode;
}) {
  const css = `:root{
  --primary: ${theme.primary};
  --secondary: ${theme.secondary};
  --ring: ${theme.primary};
  --accent-foreground: ${theme.primary};
}`;

  return (
    <>
      <style>{css}</style>
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
    </>
  );
}
