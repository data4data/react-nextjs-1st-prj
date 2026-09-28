"use client";

import type { Site } from "@/lib/cms/types";

/**
 * Park colors on this frame only. The CMS chrome stays grey; writing the same
 * variables on :root would recolor the sidebar too.
 */
export function PreviewFrame({
  theme,
  children,
}: {
  theme: Site["theme"];
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border bg-background text-foreground shadow-sm"
      style={
        {
          "--primary": theme.primary,
          "--secondary": theme.secondary,
          "--ring": theme.primary,
          "--accent-foreground": theme.primary,
          "--section-tint": `color-mix(in oklch, ${theme.secondary} 14%, var(--background))`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
