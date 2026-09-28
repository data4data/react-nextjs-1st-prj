import { CmsHeader } from "@/components/cms-header";
import { getUser } from "@/lib/auth/session";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <>
      <CmsHeader user={user} />
      {children}
    </>
  );
}
