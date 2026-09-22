import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/session";

/**
 * Layout for the CMS. Deliberately plain: the person editing the site should
 * not be looking at the site's own header and footer while they work.
 */
export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
          <Link href="/" className="text-sm font-semibold">
            Beheer
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Alle websites
            </Link>

            {user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user.email}
                </span>
                <form action={logout}>
                  <Button type="submit" variant="outline" size="sm">
                    Uitloggen
                  </Button>
                </form>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
