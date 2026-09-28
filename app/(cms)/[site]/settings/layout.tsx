import { SettingsNav } from "@/components/settings/settings-nav";
import { loadSettingsSite } from "@/lib/cms/load-settings-site";

/**
 * Sidebar + page for every settings URL. Login does not use this file, so it
 * stays a plain form.
 */
export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site: slug } = await params;
  const site = await loadSettingsSite(slug);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="lg:sticky lg:top-20 lg:w-60 lg:shrink-0 lg:self-start">
        <SettingsNav site={site} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
