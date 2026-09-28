"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Sun, Tent, TreePine, Waves } from "lucide-react";
import { cn } from "cn";

import { ColorField, TextAreaField, TextField } from "@/components/settings/fields";
import { SettingsCard } from "@/components/settings/settings-card";
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
  Icon: typeof TreePine;
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
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,2fr)] items-end gap-4">
      <IconSelect
        label="Icoon"
        value={site.header.logoIcon}
        onChange={(logoIcon) =>
          onChange({ ...site, header: { ...site.header, logoIcon } })
        }
      />
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
    </div>
  );
}

function IconSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Site["header"]["logoIcon"];
  onChange: (value: Site["header"]["logoIcon"]) => void;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected =
    logoIconOptions.find((option) => option.value === value) ?? logoIconOptions[0];
  const SelectedIcon = selected.Icon;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Button
        id={id}
        type="button"
        variant="outline"
        aria-label={selected.label}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="h-8 w-full min-w-0 justify-between px-2"
        onClick={() => setOpen((current) => !current)}
      >
        <SelectedIcon />
        <ChevronDown className={cn("size-3.5", open && "rotate-180")} />
      </Button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 z-50 mt-1 flex gap-1 rounded-lg border bg-background p-1 shadow-sm"
        >
          {logoIconOptions.map(({ value: option, label: optionLabel, Icon }) => (
            <Button
              key={option}
              type="button"
              size="icon"
              variant={option === value ? "default" : "ghost"}
              role="option"
              aria-label={optionLabel}
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              <Icon />
            </Button>
          ))}
        </div>
      ) : null}
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
      <SettingsCard title="Adres en gegevens">
        <TextAreaField
          label="Tekst"
          value={site.footer.text}
          rows={2}
          onChange={(text) => onChange({ ...site, footer: { ...site.footer, text } })}
        />
      </SettingsCard>

      {site.footer.links.map((link, index) => (
        <SettingsCard key={index} title={`Link ${index + 1}`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Tekst"
              value={link.label}
              onChange={(label) => {
                const links = site.footer.links.map((item, i) =>
                  i === index ? { ...item, label } : item
                );
                onChange({ ...site, footer: { ...site.footer, links } });
              }}
            />
            <TextField
              label="Adres"
              value={link.href}
              onChange={(href) => {
                const links = site.footer.links.map((item, i) =>
                  i === index ? { ...item, href } : item
                );
                onChange({ ...site, footer: { ...site.footer, links } });
              }}
            />
          </div>
        </SettingsCard>
      ))}
    </div>
  );
}
