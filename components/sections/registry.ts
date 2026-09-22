import type { ComponentType } from "react";

import { CarouselSection } from "@/components/sections/carousel-section";
import { ContactSection } from "@/components/sections/contact-section";
import { InfoSection } from "@/components/sections/info-section";
import { TabsSection } from "@/components/sections/tabs-section";
import type { Section, SectionType } from "@/lib/cms/types";

export type SectionComponentProps<T extends Section = Section> = {
  section: T;
  index: number;
  /** Which website this section belongs to. Most sections ignore it. */
  siteSlug: string;
};

/**
 * The list of section types the website can render.
 *
 * The page never asks "is this a carousel?". It looks the type up here. Adding
 * a new section means: add it to the `Section` union, write the component, and
 * add one line below. The page is never touched.
 *
 * `Partial` is deliberate: the CMS may know about a type that the website does
 * not render yet. `SectionRenderer` skips anything it cannot find.
 */
type SectionRegistry = {
  [K in SectionType]?: ComponentType<SectionComponentProps<Extract<Section, { type: K }>>>;
};

export const sectionRegistry: SectionRegistry = {
  carousel: CarouselSection,
  info: InfoSection,
  tabs: TabsSection,
  contact: ContactSection,
};
