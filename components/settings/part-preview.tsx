"use client";

import type { ComponentType } from "react";

import {
  sectionRegistry,
  type SectionComponentProps,
} from "@/components/sections/registry";
import { PreviewFrame } from "@/components/settings/preview-frame";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Section, Site } from "@/lib/cms/types";

function previewIndex(site: Site, sectionId: string): number {
  const visible = site.sections.filter((section) => section.visible);
  const amongVisible = visible.findIndex((section) => section.id === sectionId);

  if (amongVisible >= 0) return amongVisible;

  return Math.max(
    0,
    site.sections.findIndex((section) => section.id === sectionId)
  );
}

/**
 * Name, description and park colours in one frame, so the editor sees the
 * result the visitor will get — not two separate knobs.
 */
export function GeneralPreview({ site }: { site: Site }) {
  return (
    <PreviewFrame theme={site.theme}>
      <div className="flex h-16 items-center border-b bg-background/90 px-6">
        <p className="truncate font-semibold text-primary">{site.title}</p>
      </div>
      <div className="bg-section-tint px-6 py-10">
        <p className="text-sm text-muted-foreground">Secundaire kleur, gewassen</p>
        <p className="mt-2 text-2xl font-semibold text-pretty">{site.title}</p>
        {site.description ? (
          <p className="mt-4 max-w-prose leading-relaxed text-pretty text-muted-foreground">
            {site.description}
          </p>
        ) : null}
        <Button className="mt-6">Primaire kleur</Button>
      </div>
    </PreviewFrame>
  );
}

export function HeaderPreview({ site }: { site: Site }) {
  return (
    <PreviewFrame theme={site.theme}>
      <SiteHeader header={site.header} siteSlug={site.slug} fill />
    </PreviewFrame>
  );
}

export function FooterPreview({ site }: { site: Site }) {
  return (
    <PreviewFrame theme={site.theme}>
      <SiteFooter footer={site.footer} siteName={site.title} fill />
    </PreviewFrame>
  );
}

export function SectionPreview({
  site,
  section,
}: {
  site: Site;
  section: Section;
}) {
  const Component = sectionRegistry[section.type] as
    | ComponentType<SectionComponentProps>
    | undefined;

  if (!Component) {
    return (
      <p className="text-sm text-muted-foreground">
        Voor dit type sectie is nog geen voorbeeld.
      </p>
    );
  }

  return (
    <PreviewFrame theme={site.theme}>
      <Component
        section={section}
        index={previewIndex(site, section.id)}
        siteSlug={site.slug}
      />
    </PreviewFrame>
  );
}
