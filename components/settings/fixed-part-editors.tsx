"use client";

import { PartEditor } from "@/components/settings/part-editor";
import {
  ColorsPreview,
  FooterPreview,
  GeneralPreview,
  HeaderPreview,
} from "@/components/settings/part-preview";
import {
  ColorsForm,
  FooterForm,
  GeneralForm,
  HeaderForm,
} from "@/components/settings/site-fields";
import { useSaveSite } from "@/components/settings/use-save-site";
import type { Site } from "@/lib/cms/types";

export function GeneralEditor({ initialSite }: { initialSite: Site }) {
  const { site, setSite, hasChanges, isPending, save } = useSaveSite(initialSite);

  return (
    <PartEditor
      title="Algemeen"
      siteHref={`/${site.slug}`}
      hasChanges={hasChanges}
      isPending={isPending}
      onSave={save}
      preview={<GeneralPreview site={site} />}
    >
      <GeneralForm site={site} onChange={setSite} />
    </PartEditor>
  );
}

export function ColorsEditor({ initialSite }: { initialSite: Site }) {
  const { site, setSite, hasChanges, isPending, save } = useSaveSite(initialSite);

  return (
    <PartEditor
      title="Kleuren"
      siteHref={`/${site.slug}`}
      hasChanges={hasChanges}
      isPending={isPending}
      onSave={save}
      preview={<ColorsPreview site={site} />}
    >
      <ColorsForm site={site} onChange={setSite} />
    </PartEditor>
  );
}

export function HeaderEditor({ initialSite }: { initialSite: Site }) {
  const { site, setSite, hasChanges, isPending, save } = useSaveSite(initialSite);

  return (
    <PartEditor
      title="Koptekst"
      siteHref={`/${site.slug}`}
      hasChanges={hasChanges}
      isPending={isPending}
      onSave={save}
      preview={<HeaderPreview site={site} />}
    >
      <HeaderForm site={site} onChange={setSite} />
    </PartEditor>
  );
}

export function FooterEditor({ initialSite }: { initialSite: Site }) {
  const { site, setSite, hasChanges, isPending, save } = useSaveSite(initialSite);

  return (
    <PartEditor
      title="Voettekst"
      siteHref={`/${site.slug}`}
      hasChanges={hasChanges}
      isPending={isPending}
      onSave={save}
      preview={<FooterPreview site={site} />}
    >
      <FooterForm site={site} onChange={setSite} />
    </PartEditor>
  );
}
