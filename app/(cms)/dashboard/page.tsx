import { SiteEditor } from "@/components/dashboard/site-editor";
import { requireUser } from "@/lib/auth/session";
import { getSite } from "@/lib/cms/repository";

export const metadata = {
  title: "Beheer",
};

export default async function DashboardPage() {
  // proxy.ts already blocked anonymous visitors; this makes the page itself
  // safe too, no matter how it is reached.
  await requireUser();

  const site = await getSite();

  return <SiteEditor initialSite={site} />;
}
