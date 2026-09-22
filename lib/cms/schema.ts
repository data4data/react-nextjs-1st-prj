import { z } from "zod";

/**
 * The shape of the CMS content.
 *
 * This file is the single source of truth. The TypeScript types in `types.ts`
 * are inferred from these schemas, so the validation and the types can never
 * disagree with each other.
 */

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, { error: "Use a hex color like #2f6f4e" });

const sectionBase = z.object({
  id: z.string().min(1),
  visible: z.boolean(),
});

export const carouselSectionSchema = sectionBase.extend({
  type: z.literal("carousel"),
  slides: z
    .array(
      z.object({
        image: z.string().min(1),
        title: z.string().min(1),
        text: z.string(),
      })
    )
    .min(1),
});

export const infoSectionSchema = sectionBase.extend({
  type: z.literal("info"),
  heading: z.string().min(1),
  body: z.string(),
});

export const tabsSectionSchema = sectionBase.extend({
  type: z.literal("tabs"),
  heading: z.string().min(1),
  orientation: z.enum(["horizontal", "vertical"]),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        heading: z.string().min(1),
        body: z.string(),
        image: z.string().optional(),
      })
    )
    .min(1),
});

export const contactSectionSchema = sectionBase.extend({
  type: z.literal("contact"),
  heading: z.string().min(1),
  body: z.string(),
  buttonLabel: z.string().min(1),
});

export const sectionSchema = z.discriminatedUnion("type", [
  carouselSectionSchema,
  infoSectionSchema,
  tabsSectionSchema,
  contactSectionSchema,
]);

export const siteSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  theme: z.object({
    primary: hexColor,
    secondary: hexColor,
  }),
  header: z.object({
    logoText: z.string().min(1),
    ctaLabel: z.string().min(1),
  }),
  footer: z.object({
    text: z.string(),
    links: z.array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    ),
  }),
  sections: z.array(sectionSchema),
});

/** What a visitor may send through the contact modal. */
export const contactMessageSchema = z.object({
  name: z.string().min(2, { error: "Vul minimaal 2 tekens in" }).trim(),
  email: z.email({ error: "Vul een geldig e-mailadres in" }).trim(),
  message: z
    .string()
    .min(10, { error: "Vertel iets meer, minimaal 10 tekens" })
    .max(2000, { error: "Maximaal 2000 tekens" })
    .trim(),
});
