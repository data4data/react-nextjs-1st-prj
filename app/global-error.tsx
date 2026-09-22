"use client";

/**
 * Last resort: this replaces the root layout when the layout itself crashes.
 * It renders its own <html> and <body> and receives no global styles, so the
 * few styles it needs are inline.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="nl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Er ging iets mis</h1>
          <p style={{ marginTop: "0.75rem", color: "#555" }}>
            De website kon niet worden geladen. Probeer het opnieuw.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Probeer opnieuw
          </button>
          {error.digest ? (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#888" }}>
              Referentie: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
