"use client";

import { PartEditor } from "@/components/settings/part-editor";
import {
  FooterPreview,
  GeneralPreview,
  HeaderPreview,
} from "@/components/settings/part-preview";
import { SettingsCard } from "@/components/settings/settings-card";
import { useSettingsSite } from "@/components/settings/settings-site-context";
import {
  ColorsForm,
  FooterForm,
  GeneralForm,
  HeaderForm,
} from "@/components/settings/site-fields";

export function GeneralEditor() {
  const { site, setSite } = useSettingsSite();

  return (
    <PartEditor
      title="Algemeen"
      siteHref={`/${site.slug}`}
      preview={<GeneralPreview site={site} />}
    >
      <div className="grid gap-4">
        <SettingsCard title="Naam en omschrijving">
          <GeneralForm site={site} onChange={setSite} />
        </SettingsCard>
        <SettingsCard title="Kleuren">
          <ColorsForm site={site} onChange={setSite} />
        </SettingsCard>
      </div>
    </PartEditor>
  );
}

export function HeaderEditor() {
  const { site, setSite } = useSettingsSite();

  return (
    <PartEditor
      title="Koptekst"
      siteHref={`/${site.slug}`}
      preview={<HeaderPreview site={site} />}
    >
      <SettingsCard title="Naam, knop en icoon">
        <HeaderForm site={site} onChange={setSite} />
      </SettingsCard>
    </PartEditor>
  );
}

export function FooterEditor() {
  const { site, setSite } = useSettingsSite();

  return (
    <PartEditor
      title="Voettekst"
      siteHref={`/${site.slug}`}
      preview={<FooterPreview site={site} />}
    >
      <FooterForm site={site} onChange={setSite} />
    </PartEditor>
  );
}
