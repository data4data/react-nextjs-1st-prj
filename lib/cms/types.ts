import type { z } from "zod";

import type {
  carouselSectionSchema,
  contactMessageSchema,
  contactSectionSchema,
  infoSectionSchema,
  sectionSchema,
  siteSchema,
  tabsSectionSchema,
} from "./schema";

export type Site = z.infer<typeof siteSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section["type"];

/** Just enough of a site to draw a card on the index page. */
export type SiteSummary = Pick<Site, "slug" | "title" | "description" | "theme">;

export type CarouselSectionData = z.infer<typeof carouselSectionSchema>;
export type InfoSectionData = z.infer<typeof infoSectionSchema>;
export type TabsSectionData = z.infer<typeof tabsSectionSchema>;
export type ContactSectionData = z.infer<typeof contactSectionSchema>;

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export type StoredMessage = ContactMessage & {
  id: string;
  createdAt: string;
};

/**
 * What every server action gives back to the form that called it.
 * `errors` holds one or more messages per field, so they can be shown inline.
 */
export type ActionResult = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
