"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";

/**
 * A separate boundary for the CMS. A failing save shows this screen while the
 * public website keeps working.
 */
export default function CmsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Het beheerscherm gaf een fout"
      description="De wijziging is mogelijk niet opgeslagen. Probeer het opnieuw en controleer daarna of uw tekst nog klopt."
      digest={error.digest}
      action={<Button onClick={() => retry()}>Probeer opnieuw</Button>}
    />
  );
}
