"use client";

import type { ComponentType } from "react";

import { PartEditor } from "@/components/settings/part-editor";
import { SectionPreview } from "@/components/settings/part-preview";
import { sectionFormRegistry } from "@/components/settings/section-forms";
import { useSettingsSite } from "@/components/settings/settings-site-context";
import { sectionLabels } from "@/lib/cms/section-labels";
import type { Section } from "@/lib/cms/types";

type SectionFormProps = { section: Section; onChange: (section: Section) => void };

export function SectionPartEditor({ sectionId }: { sectionId: string }) {
  const { site, setSite } = useSettingsSite();
  const index = site.sections.findIndex((section) => section.id === sectionId);
  const section = site.sections[index];

  if (!section) return null;

  const Form = sectionFormRegistry[section.type] as
    | ComponentType<SectionFormProps>
    | undefined;
  const label = sectionLabels[section.type] ?? section.type;

  function updateSection(next: Section) {
    setSite({
      ...site,
      sections: site.sections.map((item, i) => (i === index ? next : item)),
    });
  }

  return (
    <PartEditor
      title={label}
      siteHref={`/${site.slug}`}
      preview={<SectionPreview site={site} section={section} />}
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
