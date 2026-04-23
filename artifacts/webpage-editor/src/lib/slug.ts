/**
 * Converts a business name into a clean subdomain-safe slug.
 * Strips all non-alphanumeric characters so the result is one
 * continuous lowercase word — e.g. "Toby's" → "tobys",
 * "Glamour Nails" → "glamournails".
 * Returns an empty string if nothing alphanumeric remains.
 */
export function toSubdomain(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}
