"use client";

import type { ComponentType } from "react";

import { TextAreaField, TextField } from "@/components/settings/fields";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type {
  CarouselSectionData,
  ContactSectionData,
  InfoSectionData,
  Section,
  SectionType,
  TabsSectionData,
} from "@/lib/cms/types";

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
    <div className="grid gap-6">
      {section.slides.map((slide, index) => (
        <div key={index} className="grid gap-4">
          {index > 0 ? <Separator /> : null}
          <p className="text-sm font-medium text-muted-foreground">
            Slide {index + 1}
          </p>
          <TextField
            label="Titel"
            value={slide.title}
            onChange={(title) => updateSlide(index, { title })}
          />
          <TextAreaField
            label="Tekst"
            value={slide.text}
            rows={2}
            onChange={(text) => updateSlide(index, { text })}
          />
          <TextField
            label="Afbeelding"
            value={slide.image}
            placeholder="/hero-images/veluwe1.png"
            onChange={(image) => updateSlide(index, { image })}
          />
        </div>
      ))}
    </div>
  );
}

function InfoForm({ section, onChange }: FormProps<InfoSectionData>) {
  return (
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
  );
}

function TabsForm({ section, onChange }: FormProps<TabsSectionData>) {
  function updateItem(index: number, patch: Partial<TabsSectionData["items"][number]>) {
    const items = section.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ ...section, items });
  }

  return (
    <div className="grid gap-6">
      <TextField
        label="Kop"
        value={section.heading}
        onChange={(heading) => onChange({ ...section, heading })}
      />

      <div className="grid gap-2">
        <Label>Richting van de tabs</Label>
        <div className="flex gap-2">
          {(["horizontal", "vertical"] as const).map((orientation) => (
            <Button
              key={orientation}
              type="button"
              variant={section.orientation === orientation ? "default" : "outline"}
              onClick={() => onChange({ ...section, orientation })}
            >
              {orientation === "horizontal" ? "Naast elkaar" : "Onder elkaar"}
            </Button>
          ))}
        </div>
      </div>

      {section.items.map((item, index) => (
        <div key={index} className="grid gap-4">
          <Separator />
          <p className="text-sm font-medium text-muted-foreground">Tab {index + 1}</p>
          <TextField
            label="Tablabel"
            value={item.label}
            onChange={(label) => updateItem(index, { label })}
          />
          <TextField
            label="Kop"
            value={item.heading}
            onChange={(heading) => updateItem(index, { heading })}
          />
          <TextAreaField
            label="Tekst"
            value={item.body}
            rows={4}
            onChange={(body) => updateItem(index, { body })}
          />
          <TextField
            label="Afbeelding"
            value={item.image ?? ""}
            placeholder="/hero-images/veluwe1.png"
            onChange={(image) => updateItem(index, { image: image || undefined })}
          />
        </div>
      ))}
    </div>
  );
}

function ContactForm({ section, onChange }: FormProps<ContactSectionData>) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Kop"
        value={section.heading}
        onChange={(heading) => onChange({ ...section, heading })}
      />
      <TextAreaField
        label="Tekst"
        value={section.body}
        rows={3}
        onChange={(body) => onChange({ ...section, body })}
      />
      <TextField
        label="Tekst op de knop"
        value={section.buttonLabel}
        onChange={(buttonLabel) => onChange({ ...section, buttonLabel })}
      />
    </div>
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

/** Friendly names for the section headings in the CMS. */
export const sectionLabels: Record<SectionType, string> = {
  carousel: "Slider",
  info: "Tekstblok",
  tabs: "Tabs",
  contact: "Contact",
};
