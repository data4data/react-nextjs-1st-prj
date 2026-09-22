import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import { contactMessageSchema, siteSchema } from "./schema";
import type { ContactMessage, Site, StoredMessage } from "./types";

/**
 * The only place that knows where the content is stored.
 *
 * Today that is a JSON file on disk. When a real backend arrives, only the
 * bodies of these functions change to `fetch(...)` calls; every page, section
 * and form keeps working unchanged. That is why they are already async.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_FILE = path.join(DATA_DIR, "site.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.local.json");

/**
 * `cache` keeps the result for the duration of one request, so the layout and
 * the page can both call `getSite()` while the file is only read once.
 */
export const getSite = cache(async (): Promise<Site> => {
  const raw = await readFile(SITE_FILE, "utf8");
  const parsed = siteSchema.safeParse(JSON.parse(raw));

  if (!parsed.success) {
    throw new Error(`site.json does not match the schema: ${parsed.error.message}`);
  }

  return parsed.data;
});

export async function saveSite(site: Site): Promise<Site> {
  const parsed = siteSchema.safeParse(site);

  if (!parsed.success) {
    throw new Error(`Refusing to save invalid site content: ${parsed.error.message}`);
  }

  await writeFile(SITE_FILE, `${JSON.stringify(parsed.data, null, 2)}\n`, "utf8");

  return parsed.data;
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
