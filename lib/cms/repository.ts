import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { contactMessageSchema, siteSchema, slugSchema } from "./schema";
import type { ContactMessage, Site, SiteSummary, StoredMessage } from "./types";

/**
 * The only place that knows where the content is stored.
 *
 * Today that is one JSON file per website in `data/sites/`. When a real backend
 * arrives, only the bodies of these functions change to `fetch(...)` calls;
 * every page, section and form keeps working unchanged. That is why they are
 * already async.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const SITES_DIR = path.join(DATA_DIR, "sites");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.local.json");

/**
 * Turns a slug into a file path, and refuses anything that is not a slug.
 *
 * The slug arrives from the URL, so a visitor fully controls it. Without this
 * check a request for `/..%2F..%2Fetc%2Fpasswd` would be joined straight into a
 * path and read a file outside `data/sites/`.
 */
function siteFile(slug: string): string | null {
  return slugSchema.safeParse(slug).success
    ? path.join(SITES_DIR, `${slug}.json`)
    : null;
}

/**
 * `cache` keeps the result for the duration of one request, so the layout and
 * the page can both call `getSite("zeeduin")` while the file is read once.
 *
 * Returns `null` for a slug that does not exist, so the page can answer with a
 * 404 instead of crashing.
 */
export const getSite = cache(async (slug: string): Promise<Site | null> => {
  const file = siteFile(slug);
  if (!file) return null;

  let raw: string;

  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }

  const parsed = siteSchema.safeParse(JSON.parse(raw));

  if (!parsed.success) {
    throw new Error(`${slug}.json does not match the schema: ${parsed.error.message}`);
  }

  return parsed.data;
});

/** Every website in the CMS, for the index page and for `generateStaticParams`. */
export const listSites = cache(async (): Promise<SiteSummary[]> => {
  const files = await readdir(SITES_DIR);
  const slugs = files.filter((file) => file.endsWith(".json")).map((file) => file.slice(0, -5));

  const sites = await Promise.all(slugs.map((slug) => getSite(slug)));

  return sites
    .filter((site): site is Site => site !== null)
    .map(({ slug, title, description, theme }) => ({ slug, title, description, theme }))
    .sort((a, b) => a.title.localeCompare(b.title, "nl"));
});

export async function saveSite(slug: string, site: Site): Promise<Site> {
  const file = siteFile(slug);

  if (!file) {
    throw new Error(`Refusing to save to an invalid slug: ${slug}`);
  }

  const parsed = siteSchema.safeParse(site);

  if (!parsed.success) {
    throw new Error(`Refusing to save invalid site content: ${parsed.error.message}`);
  }

  // The slug in the URL wins, so an edited body can never overwrite another site.
  const content: Site = { ...parsed.data, slug };

  await writeFile(file, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return content;
}

export async function addMessage(message: ContactMessage): Promise<StoredMessage> {
  const parsed = contactMessageSchema.parse(message);

  const stored: StoredMessage = {
    ...parsed,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const messages = await getMessages();
  messages.push(stored);

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(MESSAGES_FILE, `${JSON.stringify(messages, null, 2)}\n`, "utf8");

  return stored;
}

export async function getMessages(): Promise<StoredMessage[]> {
  try {
    const raw = await readFile(MESSAGES_FILE, "utf8");
    return JSON.parse(raw) as StoredMessage[];
  } catch (error) {
    // The file only appears after the first message is sent.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
