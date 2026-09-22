"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";

/**
 * Error boundaries must be client components, because they react to a crash
 * while the page is already in the browser.
 *
 * Next 16 passes `retry`, not the `reset` prop older tutorials show.
 */
export default function SiteError({
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
      title="Er ging iets mis"
      description="De pagina kon niet worden geladen. Probeer het opnieuw; blijft het misgaan, neem dan telefonisch contact op."
      digest={error.digest}
      action={<Button onClick={() => retry()}>Probeer opnieuw</Button>}
    />
  );
}
