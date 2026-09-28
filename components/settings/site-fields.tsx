"use client";

import type { ComponentType } from "react";
import { Sun, Tent, TreePine, Waves } from "lucide-react";

import { ColorField, TextAreaField, TextField } from "@/components/settings/fields";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Site } from "@/lib/cms/types";

const logoIconOptions = [
  { value: "tree", label: "Boom", Icon: TreePine },
  { value: "waves", label: "Golven", Icon: Waves },
  { value: "tent", label: "Tent", Icon: Tent },
  { value: "sun", label: "Zon", Icon: Sun },
] as const satisfies ReadonlyArray<{
  value: Site["header"]["logoIcon"];
  label: string;
  Icon: ComponentType<{ className?: string }>;
}>;

export function GeneralForm({
  site,
  onChange,
}: {
  site: Site;
  onChange: (site: Site) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextField
        label="Naam van de website"
        value={site.title}
        onChange={(title) => onChange({ ...site, title })}
      />
      <TextAreaField
        label="Omschrijving (voor Google en social media)"
        value={site.description}
        rows={2}
        onChange={(description) => onChange({ ...site, description })}
      />
    </div>
  );
}

export function ColorsForm({
  site,
  onChange,
}: {
  site: Site;
  onChange: (site: Site) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ColorField
        label="Primaire kleur (knoppen en accenten)"
        value={site.theme.primary}
        onChange={(primary) => onChange({ ...site, theme: { ...site.theme, primary } })}
      />
      <ColorField
        label="Secundaire kleur (banen achter de secties)"
        value={site.theme.secondary}
        onChange={(secondary) =>
          onChange({ ...site, theme: { ...site.theme, secondary } })
        }
      />
      <p className="text-sm text-muted-foreground sm:col-span-2">
        De kleuren worden als CSS-variabelen op de website gezet. Geen enkel
        component hoeft daarvoor aangepast te worden.
      </p>
    </div>
  );
}

export function HeaderForm({
  site,
  onChange,
}: {
  site: Site;
  onChange: (site: Site) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Naam in de balk"
        value={site.header.logoText}
        onChange={(logoText) =>
          onChange({ ...site, header: { ...site.header, logoText } })
        }
      />
      <TextField
        label="Tekst op de knop"
        value={site.header.ctaLabel}
        onChange={(ctaLabel) =>
          onChange({ ...site, header: { ...site.header, ctaLabel } })
        }
      />
      <div className="grid gap-2 sm:col-span-2">
        <Label>Icoon naast de naam</Label>
        <div className="flex flex-wrap gap-2">
          {logoIconOptions.map(({ value, label, Icon }) => (
            <Button
              key={value}
              type="button"
              variant={site.header.logoIcon === value ? "default" : "outline"}
              onClick={() =>
                onChange({ ...site, header: { ...site.header, logoIcon: value } })
              }
            >
              <Icon />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FooterForm({
  site,
  onChange,
}: {
  site: Site;
  onChange: (site: Site) => void;
}) {
  return (
    <div className="grid gap-4">
      <TextAreaField
        label="Adres en gegevens"
        value={site.footer.text}
        rows={2}
        onChange={(text) => onChange({ ...site, footer: { ...site.footer, text } })}
      />

      {site.footer.links.map((link, index) => (
        <div key={index} className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={`Link ${index + 1}: tekst`}
            value={link.label}
            onChange={(label) => {
              const links = site.footer.links.map((item, i) =>
                i === index ? { ...item, label } : item
              );
              onChange({ ...site, footer: { ...site.footer, links } });
            }}
          />
          <TextField
            label={`Link ${index + 1}: adres`}
            value={link.href}
            onChange={(href) => {
              const links = site.footer.links.map((item, i) =>
                i === index ? { ...item, href } : item
              );
              onChange({ ...site, footer: { ...site.footer, links } });
            }}
          />
        </div>
      ))}
    </div>
  );
}
