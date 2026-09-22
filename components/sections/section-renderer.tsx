import type { ComponentType } from "react";

import { sectionRegistry, type SectionComponentProps } from "@/components/sections/registry";
import type { Section } from "@/lib/cms/types";

/**
 * Renders the sections the CMS marked as visible, in the order they are stored.
 *
 * `index` is the position in the *rendered* list, not in the stored list, so
 * the striped background stays correct when a section is hidden.
 */
export function SectionRenderer({ sections }: { sections: Section[] }) {
  const visible = sections.filter((section) => section.visible);

  if (visible.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-24 text-center">
        <p className="text-muted-foreground">
          Deze pagina heeft nog geen inhoud.
        </p>
      </div>
    );
  }

  return (
    <>
      {visible.map((section, index) => {
        const Component = sectionRegistry[section.type] as
          | ComponentType<SectionComponentProps>
          | undefined;

        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `No component registered for section type "${section.type}". ` +
                "Add it to components/sections/registry.ts."
            );
          }
          return null;
        }

        return <Component key={section.id} section={section} index={index} />;
      })}
    </>
  );
}
