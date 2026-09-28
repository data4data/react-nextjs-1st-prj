/**
 * URL pieces that are always present in the CMS, not taken from a section id.
 * A section must never reuse one of these as its `id`, or the two routes would
 * collide. `colors` still exists as a redirect onto Algemeen.
 */
export const SETTINGS_FIXED_PATHS = [
  "general",
  "colors",
  "header",
  "footer",
] as const;

export function isFixedSettingsPath(value: string): boolean {
  return (SETTINGS_FIXED_PATHS as readonly string[]).includes(value);
}
