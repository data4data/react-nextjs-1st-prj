/**
 * Layout for the CMS. Deliberately plain: the person editing the site should
 * not be looking at the site's own header and footer while they work.
 *
 * The top bar lives in the login layout and in `[site]/layout.tsx`, so the
 * park name can sit next to Beheer only when a website is open.
 */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">{children}</div>
  );
}
