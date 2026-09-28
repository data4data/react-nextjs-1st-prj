import Link from "next/link";
import { cn } from "cn";

import { logout } from "@/app/actions/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import type { User } from "@/lib/auth/session";

/**
 * The bar at the top of the CMS. The park name sits next to Beheer, so you
 * always know which website you are editing.
 */
export function CmsHeader({
  user,
  siteTitle,
}: {
  user: User | null;
  siteTitle?: string;
}) {
  return (
    <header className="shrink-0 border-b bg-background">
      <div className="flex h-[4.25rem] w-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="shrink-0 text-sm font-semibold">
            Beheer
          </Link>
          {siteTitle ? (
            <>
              <span aria-hidden className="text-muted-foreground">
                /
              </span>
              <p className="truncate text-sm font-medium">{siteTitle}</p>
            </>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-foreground!"
            )}
          >
            Alle websites
          </Link>

          {user ? (
            <form action={logout}>
              <Button type="submit" size="sm">
                Uitloggen
              </Button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  );
}
