import { SettingsShell } from "@/components/settings/settings-shell";
import { getUser } from "@/lib/auth/session";
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
  const [site, user] = await Promise.all([loadSettingsSite(slug), getUser()]);

  return (
    <SettingsShell site={site} userEmail={user?.email}>
      {children}
    </SettingsShell>
  );
}
