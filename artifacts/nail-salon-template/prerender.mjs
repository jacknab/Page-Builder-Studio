/**
 * Static site generator for the nail salon template.
 *
 * Usage (normally called by the launch script, not directly):
 *   node prerender.mjs
 *
 * Reads:  dist/server/entry-server.js  (SSR bundle)
 *         dist/client/index.html       (Vite client build)
 *         src/client-data.json         (client business data)
 * Writes: dist/client/index.html       (final prerendered HTML)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, p);

// ─── SEO helpers ────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function extractCity(address) {
  if (!address) return "";
  const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) return parts[parts.length - 2];
  if (parts.length === 2) return parts[1];
  return "";
}

const DAY_ABBR = {
  monday: "Mo", tuesday: "Tu", wednesday: "We",
  thursday: "Th", friday: "Fr", saturday: "Sa", sunday: "Su",
};

function to24h(timeStr) {
  const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

function buildOpeningHours(hours) {
  if (!hours || typeof hours !== "object") return [];
  return Object.entries(hours)
    .filter(([, v]) => v && !/closed/i.test(v))
    .map(([day, val]) => {
      const abbr = DAY_ABBR[day.toLowerCase()];
      if (!abbr) return null;
      const parts = val.split(/\s*[–\-]\s*/);
      if (parts.length !== 2) return null;
      const open = to24h(parts[0]);
      const close = to24h(parts[1]);
      if (!open || !close) return null;
      return `${abbr} ${open}-${close}`;
    })
    .filter(Boolean);
}

function buildSeoMeta(clientData, pageTitle) {
  const city = extractCity(clientData.address);

  const serviceNames = (clientData.services || []).map((s) => s.name);

  const metaDescription = clientData.description
    ? clientData.description.slice(0, 155)
    : [
        `${clientData.businessName} is your local nail salon`,
        city ? `in ${city}` : null,
        "offering manicures, pedicures, gel nails, acrylics, and nail art.",
        "Book your appointment today.",
      ]
        .filter(Boolean)
        .join(" ");

  const keywords = [
    "nail salon near me",
    "manicure near me",
    "pedicure near me",
    "nail salon",
    "gel nails near me",
    "acrylic nails near me",
    clientData.businessName,
    city ? `${city} nail salon` : null,
    city ? `nail salon ${city}` : null,
    city ? `manicure ${city}` : null,
    city ? `pedicure ${city}` : null,
    city ? `best nail salon ${city}` : null,
    city ? `gel nails ${city}` : null,
    city ? `acrylic nails ${city}` : null,
    city ? `nail art ${city}` : null,
    "gel manicure",
    "dip powder nails",
    "nail art",
    "spa pedicure",
    "nail technician near me",
    ...serviceNames.map((s) => s.toLowerCase()),
  ]
    .filter(Boolean)
    .join(", ");

  const openingHours = buildOpeningHours(clientData.hours);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: clientData.businessName,
    description: metaDescription,
    ...(clientData.phone && { telephone: clientData.phone }),
    ...(clientData.email && { email: clientData.email }),
    ...(clientData.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: clientData.address,
      },
    }),
    ...(clientData.googleUrl && { hasMap: clientData.googleUrl }),
    ...(openingHours.length > 0 && { openingHours }),
    ...(clientData.established && { foundingDate: String(clientData.established) }),
    priceRange: "$$",
  };

  const lines = [
    `<meta name="description" content="${esc(metaDescription)}" />`,
    `<meta name="keywords" content="${esc(keywords)}" />`,
    `<meta name="author" content="${esc(clientData.businessName)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta name="googlebot" content="index, follow" />`,
    `<meta name="revisit-after" content="7 days" />`,
    ``,
    `<!-- LLM / AI search optimisation -->`,
    `<meta name="abstract" content="${esc(clientData.businessName + " — " + metaDescription)}" />`,
    `<meta name="ai-content-declaration" content="human-created" />`,
    ``,
    `<!-- Open Graph -->`,
    `<meta property="og:type" content="local.business" />`,
    `<meta property="og:title" content="${esc(pageTitle)}" />`,
    `<meta property="og:description" content="${esc(metaDescription)}" />`,
    `<meta property="og:site_name" content="${esc(clientData.businessName)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    clientData.phone
      ? `<meta property="business:contact_data:phone_number" content="${esc(clientData.phone)}" />`
      : null,
    clientData.address
      ? `<meta property="business:contact_data:street_address" content="${esc(clientData.address)}" />`
      : null,
    ``,
    `<!-- Twitter Card -->`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(pageTitle)}" />`,
    `<meta name="twitter:description" content="${esc(metaDescription)}" />`,
    city
      ? `\n<!-- Geo -->\n<meta name="geo.placename" content="${esc(city)}" />`
      : null,
    ``,
    `<!-- Local Business structured data -->`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`,
  ]
    .filter((l) => l !== null)
    .join("\n    ");

  return lines;
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("Prerendering nail salon template…");

const { render } = await import(toAbs("./dist/server/entry-server.js"));
const template = await fs.readFile(toAbs("./dist/client/index.html"), "utf-8");
const clientData = JSON.parse(
  await fs.readFile(toAbs("./src/client-data.json"), "utf-8")
);

const appHtml = render();

const pageTitle = `${clientData.businessName} – ${clientData.tagline}`;
const seoMeta = buildSeoMeta(clientData, pageTitle);

const html = template
  .replace("<!--ssr-outlet-->", appHtml)
  .replace("<!--page-title-->", esc(pageTitle))
  .replace("<!--seo-meta-->", seoMeta);

await fs.writeFile(toAbs("./dist/client/index.html"), html);
console.log("Prerender complete → dist/client/index.html");
