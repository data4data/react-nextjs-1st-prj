import { CmsHeader } from "@/components/cms-header";
import { getUser } from "@/lib/auth/session";
import { loadSettingsSite } from "@/lib/cms/load-settings-site";

/**
 * Settings for one park. The header names that park next to Beheer.
 */
export default async function CmsSiteLayout({
  children,
  params,
}: LayoutProps<"/[site]">) {
  const { site: slug } = await params;
  const [site, user] = await Promise.all([loadSettingsSite(slug), getUser()]);

  return (
    <>
      <CmsHeader user={user} siteTitle={site.title} />
      {children}
    </>
  );
}
