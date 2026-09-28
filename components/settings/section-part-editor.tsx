"use client";

import type { ComponentType } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";

import { PartEditor } from "@/components/settings/part-editor";
import { SectionPreview } from "@/components/settings/part-preview";
import { sectionFormRegistry } from "@/components/settings/section-forms";
import { useSaveSite } from "@/components/settings/use-save-site";
import { Button } from "@/components/ui/button";
import { sectionLabels } from "@/lib/cms/section-labels";
import type { Section, Site } from "@/lib/cms/types";

type SectionFormProps = { section: Section; onChange: (section: Section) => void };

export function SectionPartEditor({
  initialSite,
  sectionId,
}: {
  initialSite: Site;
  sectionId: string;
}) {
  const { site, setSite, hasChanges, isPending, save } = useSaveSite(initialSite);
  const index = site.sections.findIndex((section) => section.id === sectionId);
  const section = site.sections[index];

  if (!section) return null;

  const Form = sectionFormRegistry[section.type] as
    | ComponentType<SectionFormProps>
    | undefined;

  function updateSection(next: Section) {
    setSite({
      ...site,
      sections: site.sections.map((item, i) => (i === index ? next : item)),
    });
  }

  function moveSection(direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= site.sections.length) return;

    const sections = [...site.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setSite({ ...site, sections });
  }

  return (
    <PartEditor
      title={sectionLabels[section.type] ?? section.type}
      siteHref={`/${site.slug}`}
      hasChanges={hasChanges}
      isPending={isPending}
      onSave={save}
      preview={<SectionPreview site={site} section={section} />}
      extras={
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Omhoog"
            disabled={index === 0}
            onClick={() => moveSection(-1)}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Omlaag"
            disabled={index === site.sections.length - 1}
            onClick={() => moveSection(1)}
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={section.visible ? "Verbergen" : "Tonen"}
            onClick={() => updateSection({ ...section, visible: !section.visible })}
          >
            {section.visible ? <Eye /> : <EyeOff />}
          </Button>
        </div>
      }
    >
      {Form ? (
        <Form section={section} onChange={updateSection} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Voor dit type sectie is nog geen formulier.
        </p>
      )}
    </PartEditor>
  );
}
