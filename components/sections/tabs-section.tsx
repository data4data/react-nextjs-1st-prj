import { SectionShell } from "@/components/sections/section-shell";
import { PhotoStrip } from "@/components/sections/tabs/photo-strip";
import { TabPanels } from "@/components/sections/tabs/tab-panels";
import type { TabsSectionData } from "@/lib/cms/types";

/**
 * A few subjects behind one heading, with a picture for each.
 *
 * The CMS picks one of two ways to draw them, and both run left to right:
 *
 * - `strip`: one wide picture with the text on it, and small pictures under it
 *   to switch with.
 * - `panels`: a row of columns where the open one grows wide.
 *
 * This file only chooses; the two files it calls do the drawing. That keeps
 * each layout in one place and lets a third one be added later without
 * touching either of them.
 */
export function TabsSection({
  section,
  index,
}: {
  section: TabsSectionData;
  index: number;
}) {
  return (
    <SectionShell id={section.id} index={index}>
      <div className="grid gap-4 md:grid-cols-2 md:items-end md:gap-12">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {section.heading}
        </h2>
        {section.intro ? (
          <p className="leading-relaxed text-pretty text-muted-foreground md:pb-1">
            {section.intro}
          </p>
        ) : null}
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12">
        {section.layout === "panels" ? (
          <TabPanels items={section.items} />
        ) : (
          <PhotoStrip items={section.items} />
        )}
      </div>
    </SectionShell>
  );
}
