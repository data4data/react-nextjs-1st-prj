import Link from "next/link";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title: string;
  description: string;
  /** Shown small and grey. Use it to match a report with the server logs. */
  digest?: string;
  action?: React.ReactNode;
};

/**
 * One look for every error screen: the 404 page, the public error boundary and
 * the CMS error boundary all render this, so a styling change happens once.
 */
export function ErrorState({ title, description, digest, action }: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-balance sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-prose text-pretty text-muted-foreground">{description}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {action}
        <Button variant="outline" render={<Link href="/" />}>
          Terug naar de homepagina
        </Button>
      </div>

      {digest ? (
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          Referentie: {digest}
        </p>
      ) : null}
    </div>
  );
}
