"use client";

import { useState, useTransition, type ComponentType } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, EyeOff, Sun, Tent, TreePine, Waves } from "lucide-react";
import { toast } from "sonner";

import { saveSiteAction } from "@/app/actions/site";
import { ColorField, TextAreaField, TextField } from "@/components/settings/fields";
import { sectionFormRegistry, sectionLabels } from "@/components/settings/section-forms";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Section, Site } from "@/lib/cms/types";

type SectionFormProps = { section: Section; onChange: (section: Section) => void };

/**
 * The icons a website can choose from. The list matches the `logoIcon` enum in
 * the schema, so the editor can never offer an icon the website cannot draw.
 */
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

/**
 * The edit screen.
 *
 * One piece of state holds the whole site. Every input changes a copy of that
 * object, and saving sends it to a server action. Nothing is written until the
 * save button is pressed.
 */
export function SiteEditor({ initialSite }: { initialSite: Site }) {
  const [site, setSite] = useState<Site>(initialSite);
  const [isPending, startTransition] = useTransition();

  const hasChanges = JSON.stringify(site) !== JSON.stringify(initialSite);

  function updateSection(index: number, next: Section) {
    setSite({
      ...site,
      sections: site.sections.map((section, i) => (i === index ? next : section)),
    });
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= site.sections.length) return;

    const sections = [...site.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setSite({ ...site, sections });
  }

  function save() {
    startTransition(async () => {
      const result = await saveSiteAction(site.slug, site);

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">{initialSite.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Wijzigingen zijn pas zichtbaar op de website nadat u opslaat.
          </p>
        </div>

        <Link
          href={`/${site.slug}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Bekijk website
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Algemeen</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <TextField
            label="Naam van de website"
            value={site.title}
            onChange={(title) => setSite({ ...site, title })}
          />
          <TextAreaField
            label="Omschrijving (voor Google en social media)"
            value={site.description}
            rows={2}
            onChange={(description) => setSite({ ...site, description })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kleuren</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Primaire kleur (knoppen en accenten)"
            value={site.theme.primary}
            onChange={(primary) => setSite({ ...site, theme: { ...site.theme, primary } })}
          />
          <ColorField
            label="Secundaire kleur (banen achter de secties)"
            value={site.theme.secondary}
            onChange={(secondary) =>
              setSite({ ...site, theme: { ...site.theme, secondary } })
            }
          />

          <p className="text-sm text-muted-foreground sm:col-span-2">
            De kleuren worden als CSS-variabelen op de website gezet. Geen enkel
            component hoeft daarvoor aangepast te worden.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Koptekst</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Naam in de balk"
            value={site.header.logoText}
            onChange={(logoText) =>
              setSite({ ...site, header: { ...site.header, logoText } })
            }
          />
          <TextField
            label="Tekst op de knop"
            value={site.header.ctaLabel}
            onChange={(ctaLabel) =>
              setSite({ ...site, header: { ...site.header, ctaLabel } })
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
                    setSite({ ...site, header: { ...site.header, logoIcon: value } })
                  }
                >
                  <Icon />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voettekst</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <TextAreaField
            label="Adres en gegevens"
            value={site.footer.text}
            rows={2}
            onChange={(text) => setSite({ ...site, footer: { ...site.footer, text } })}
          />

          {site.footer.links.map((link, index) => (
            <div key={index} className="grid gap-4 sm:grid-cols-2">
              <TextField
                label={`Link ${index + 1}: tekst`}
                value={link.label}
                onChange={(label) => {
                  const links = site.footer.links.map((l, i) =>
                    i === index ? { ...l, label } : l
                  );
                  setSite({ ...site, footer: { ...site.footer, links } });
                }}
              />
              <TextField
                label={`Link ${index + 1}: adres`}
                value={link.href}
                onChange={(href) => {
                  const links = site.footer.links.map((l, i) =>
                    i === index ? { ...l, href } : l
                  );
                  setSite({ ...site, footer: { ...site.footer, links } });
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold">Secties</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verberg een sectie of verplaats hem. De tekst blijft bewaard.
        </p>
      </div>

      {site.sections.map((section, index) => {
        const Form = sectionFormRegistry[section.type] as
          | ComponentType<SectionFormProps>
          | undefined;

        return (
          <Card key={section.id} className={section.visible ? undefined : "opacity-60"}>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                {sectionLabels[section.type] ?? section.type}
                {!section.visible ? (
                  <span className="text-xs font-normal text-muted-foreground">
                    (verborgen)
                  </span>
                ) : null}
              </CardTitle>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Omhoog"
                  disabled={index === 0}
                  onClick={() => moveSection(index, -1)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Omlaag"
                  disabled={index === site.sections.length - 1}
                  onClick={() => moveSection(index, 1)}
                >
                  <ArrowDown />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={section.visible ? "Verbergen" : "Tonen"}
                  onClick={() =>
                    updateSection(index, { ...section, visible: !section.visible })
                  }
                >
                  {section.visible ? <Eye /> : <EyeOff />}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {Form ? (
                <Form
                  section={section}
                  onChange={(next) => updateSection(index, next)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Voor dit type sectie is nog geen formulier.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      <div className="sticky bottom-0 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {hasChanges ? "Niet-opgeslagen wijzigingen" : "Alles is opgeslagen"}
          </p>
          <Button onClick={save} disabled={isPending || !hasChanges} size="lg">
            {isPending ? "Bezig met opslaan..." : "Opslaan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
