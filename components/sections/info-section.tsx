import { SectionShell } from "@/components/sections/section-shell";
import type { InfoSectionData } from "@/lib/cms/types";

/**
 * A heading and a block of text. No state, no clicks, so this stays a server
 * component: it arrives in the browser as finished HTML.
 */
export function InfoSection({
  section,
  index,
}: {
  section: InfoSectionData;
  index: number;
}) {
  return (
    <SectionShell id={section.id} index={index}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
          {section.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground">
          {section.body}
        </p>
      </div>
    </SectionShell>
  );
}
