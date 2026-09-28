"use client";

import type { ComponentType } from "react";

import { SelectField, TextAreaField, TextField } from "@/components/settings/fields";
import { SettingsCard } from "@/components/settings/settings-card";
import type {
  CarouselSectionData,
  ContactSectionData,
  InfoSectionData,
  Section,
  SectionType,
  TabsSectionData,
} from "@/lib/cms/types";
import { sectionLabels } from "@/lib/cms/section-labels";

export { sectionLabels };

/**
 * One edit form per section type, looked up the same way the website looks up
 * the section components. Add a section type and you add it in both registries;
 * nothing else changes.
 */

type FormProps<T extends Section> = {
  section: T;
  onChange: (section: T) => void;
};

function CarouselForm({ section, onChange }: FormProps<CarouselSectionData>) {
  function updateSlide(index: number, patch: Partial<CarouselSectionData["slides"][number]>) {
    const slides = section.slides.map((slide, i) =>
      i === index ? { ...slide, ...patch } : slide
    );
    onChange({ ...section, slides });
  }

  return (
    <div className="grid gap-4">
      {section.slides.map((slide, index) => (
        <SettingsCard key={index} title={`Slide ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Titel"
              value={slide.title}
              onChange={(title) => updateSlide(index, { title })}
            />
            <TextField
              label="Afbeelding"
              value={slide.image}
              placeholder="/hero-images/veluwe1.png"
              onChange={(image) => updateSlide(index, { image })}
            />
            <div className="sm:col-span-2">
              <TextAreaField
                label="Tekst"
                value={slide.text}
                rows={2}
                onChange={(text) => updateSlide(index, { text })}
              />
            </div>
          </div>
        </SettingsCard>
      ))}
    </div>
  );
}

function InfoForm({ section, onChange }: FormProps<InfoSectionData>) {
  return (
    <SettingsCard title="Kop en tekst">
      <div className="grid gap-4">
        <TextField
          label="Kop"
          value={section.heading}
          onChange={(heading) => onChange({ ...section, heading })}
        />
        <TextAreaField
          label="Tekst"
          value={section.body}
          rows={6}
          onChange={(body) => onChange({ ...section, body })}
        />
      </div>
    </SettingsCard>
  );
}

/** The two ways the tabs can be drawn, with their Dutch labels. */
const tabsLayouts = [
  { value: "strip", label: "Fotostrip" },
  { value: "panels", label: "Panelen" },
] as const satisfies ReadonlyArray<{
  value: TabsSectionData["layout"];
  label: string;
}>;

function TabsForm({ section, onChange }: FormProps<TabsSectionData>) {
  function updateItem(index: number, patch: Partial<TabsSectionData["items"][number]>) {
    const items = section.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ ...section, items });
  }

  return (
    <div className="grid gap-4">
      <SettingsCard title="Algemeen">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Kop"
            value={section.heading}
            onChange={(heading) => onChange({ ...section, heading })}
          />
          <SelectField
            label="Weergave van de tabs"
            value={section.layout}
            options={tabsLayouts}
            onChange={(layout) => onChange({ ...section, layout })}
          />
          <div className="sm:col-span-2">
            <TextAreaField
              label="Introtekst naast de kop"
              value={section.intro}
              rows={2}
              onChange={(intro) => onChange({ ...section, intro })}
            />
          </div>
        </div>
      </SettingsCard>

      {section.items.map((item, index) => (
        <SettingsCard key={index} title={`Tab ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Tablabel"
              value={item.label}
              onChange={(label) => updateItem(index, { label })}
            />
            <TextField
              label="Afbeelding"
              value={item.image ?? ""}
              placeholder="/hero-images/veluwe1.png"
              onChange={(image) => updateItem(index, { image: image || undefined })}
            />
            <TextField
              label="Kop"
              value={item.heading}
              onChange={(heading) => updateItem(index, { heading })}
            />
            <TextField
              label="Kort regeltje met feiten"
              value={item.meta ?? ""}
              placeholder="300 m via vlonderpad · Strandtent maart–nov"
              onChange={(meta) => updateItem(index, { meta: meta || undefined })}
            />
            <div className="sm:col-span-2">
              <TextAreaField
                label="Omschrijving"
                value={item.body}
                rows={4}
                onChange={(body) => updateItem(index, { body })}
              />
            </div>
          </div>
        </SettingsCard>
      ))}
    </div>
  );
}

function ContactForm({ section, onChange }: FormProps<ContactSectionData>) {
  return (
    <SettingsCard title="Kop, tekst en knop">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Kop"
          value={section.heading}
          onChange={(heading) => onChange({ ...section, heading })}
        />
        <TextField
          label="Tekst op de knop"
          value={section.buttonLabel}
          onChange={(buttonLabel) => onChange({ ...section, buttonLabel })}
        />
        <div className="sm:col-span-2">
          <TextAreaField
            label="Tekst"
            value={section.body}
            rows={3}
            onChange={(body) => onChange({ ...section, body })}
          />
        </div>
      </div>
    </SettingsCard>
  );
}

type SectionFormRegistry = {
  [K in SectionType]?: ComponentType<FormProps<Extract<Section, { type: K }>>>;
};

export const sectionFormRegistry: SectionFormRegistry = {
  carousel: CarouselForm,
  info: InfoForm,
  tabs: TabsForm,
  contact: ContactForm,
};
