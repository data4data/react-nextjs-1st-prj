/**
 * Shown while the page is still being built on the server. The shapes roughly
 * match the real sections, so the page does not jump when the content lands.
 */
export default function SiteLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Bezig met laden">
      <div className="h-[60vh] min-h-80 w-full bg-muted" />
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-24">
        <div className="h-8 w-2/3 max-w-md rounded bg-muted" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-11/12 rounded bg-muted" />
          <div className="h-4 w-9/12 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
