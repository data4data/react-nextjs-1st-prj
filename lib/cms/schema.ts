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

/**
 * The name of one website, as it appears in the URL: `/veluwse-hei`.
 *
 * It is also the file name under `data/sites/`, so it is kept to letters,
 * digits and dashes. A slug can never contain a dot or a slash, which is what
 * stops a request for `/../../etc/passwd` from reaching the file system.
 */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "Use a slug like veluwse-hei" });

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
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string(),
  theme: z.object({
    primary: hexColor,
    secondary: hexColor,
  }),
  header: z.object({
    logoText: z.string().min(1),
    /** Which lucide icon sits next to the name. See `logoIcons` in the header. */
    logoIcon: z.enum(["tree", "waves", "tent", "sun"]),
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
  /** Which website the form was filled in on, so the two parks stay apart. */
  site: slugSchema,
  name: z.string().min(2, { error: "Vul minimaal 2 tekens in" }).trim(),
  email: z.email({ error: "Vul een geldig e-mailadres in" }).trim(),
  message: z
    .string()
    .min(10, { error: "Vertel iets meer, minimaal 10 tekens" })
    .max(2000, { error: "Maximaal 2000 tekens" })
    .trim(),
});
