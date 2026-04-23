import express from "express";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { clientSitesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import type { ClientSite } from "@workspace/db/schema";

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const MAIN_DOMAIN = (process.env.MAIN_DOMAIN || "launchsite.certxa.com").toLowerCase();
const TEMPLATE_DIST = process.env.TEMPLATE_DIST || path.join(process.cwd(), "artifacts/nail-salon-template/dist");

// ── Helpers ────────────────────────────────────────────────────────────────
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function schemaType(businessType: string | null | undefined): string {
  switch (businessType) {
    case "nail-salon":  return "NailSalon";
    case "barbershop":  return "BarberShop";
    case "hair-salon":  return "HairSalon";
    default:            return "LocalBusiness";
  }
}

interface ParsedAddress {
  street: string; city: string; state: string; zip: string;
}
function parseAddress(raw: string): ParsedAddress {
  const m = raw.match(/^(.+?),\s*(.+?),\s*([A-Z]{2})\s*(\d{5})?/);
  if (m) return { street: m[1].trim(), city: m[2].trim(), state: m[3], zip: m[4] || "" };
  return { street: raw, city: "", state: "", zip: "" };
}

function to24(time: string, period: string): string {
  const [h, m] = time.split(":").map(Number);
  const h24 = period?.toUpperCase() === "PM" && h !== 12 ? h + 12
             : period?.toUpperCase() === "AM" && h === 12 ? 0 : h;
  return `${String(h24).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
}

const DAY_MAP: Record<string, string> = {
  monday: "Mo", tuesday: "Tu", wednesday: "We", thursday: "Th",
  friday: "Fr", saturday: "Sa", sunday: "Su",
};

// ── SEO meta tag builder ───────────────────────────────────────────────────
function buildSeoTags(site: ClientSite, canonicalUrl: string): { title: string; meta: string } {
  const name        = site.businessName  || "Local Business";
  const tagline     = site.tagline       || "";
  const description = (site.description || tagline || `${name} — professional services.`).slice(0, 160);
  const addr        = parseAddress(site.address || "");
  const phone       = site.phone  || "";
  const email       = site.email  || "";
  const type        = schemaType(site.businessType);
  const typeName    = type.replace(/([A-Z])/g, " $1").trim();

  // Title: "Business Name | City" — concise, city-anchored
  const pageTitle = addr.city ? `${name} | ${addr.city}` : name;

  // Extended keywords
  let services: { name: string }[] = [];
  try { if (site.servicesJson) services = JSON.parse(site.servicesJson); } catch {}
  const svcKeywords = services.slice(0, 8).map(s => s.name).join(", ");
  const keywords = [name, addr.city, addr.state, typeName, svcKeywords,
    `${typeName} near me`, `best ${typeName} ${addr.city}`,
    `${typeName} ${addr.city}`, `walk-in ${typeName}`,
  ].filter(Boolean).join(", ");

  // Opening hours for JSON-LD
  let hours: Record<string, string> = {};
  try { if (site.hoursJson) hours = JSON.parse(site.hoursJson); } catch {}
  const openingHours = Object.entries(hours)
    .filter(([, v]) => v && v.toLowerCase() !== "closed")
    .map(([day, val]) => {
      const abbr = DAY_MAP[day.toLowerCase()] || day.slice(0, 2);
      const t = val.match(/(\d+:\d+)\s*(AM|PM)?\s*[-–]\s*(\d+:\d+)\s*(AM|PM)?/i);
      return t ? `${abbr} ${to24(t[1], t[2])}-${to24(t[3], t[4])}` : null;
    }).filter(Boolean);

  // JSON-LD LocalBusiness
  const sameAs = [site.googleUrl, site.instagramUrl, site.facebookUrl, site.tiktokUrl, site.yelpUrl].filter(Boolean);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
    "description": description,
    "url": canonicalUrl,
    ...(phone  ? { "telephone": phone }  : {}),
    ...(email  ? { "email": email }      : {}),
    ...(site.address ? { "address": {
      "@type": "PostalAddress",
      "streetAddress": addr.street,
      ...(addr.city  ? { "addressLocality": addr.city }  : {}),
      ...(addr.state ? { "addressRegion": addr.state }   : {}),
      ...(addr.zip   ? { "postalCode": addr.zip }        : {}),
      "addressCountry": "US",
    }} : {}),
    ...(openingHours.length ? { "openingHours": openingHours } : {}),
    ...(services.length ? { "hasOfferCatalog": {
      "@type": "OfferCatalog", "name": "Services",
      "itemListElement": services.slice(0, 10).map((s, i) => ({
        "@type": "Offer", "position": i + 1,
        "itemOffered": { "@type": "Service", "name": s.name },
      })),
    }} : {}),
    ...(sameAs.length ? { "sameAs": sameAs } : {}),
    "priceRange": "$$",
  };

  const ogType = site.businessType ? "business.business" : "local.business";

  const meta = `
    <!-- Primary -->
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords" content="${esc(keywords)}" />
    <meta name="author" content="${esc(name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow" />
    <meta name="abstract" content="${esc(description)}" />
    <meta name="rating" content="5 stars" />
    <meta name="revisit-after" content="7 days" />
    <meta name="distribution" content="global" />
    <link rel="canonical" href="${esc(canonicalUrl)}" />

    <!-- LLM / AI Search -->
    <link rel="alternate" type="text/plain" href="${esc(canonicalUrl)}/llms.txt" title="LLM Information" />
    <link rel="alternate" type="text/plain" href="${esc(canonicalUrl)}/.well-known/llms.txt" title="LLM Information" />
    <meta name="ai-content-declaration" content="human-created" />

    <!-- Geo${addr.city ? ` — ${addr.city}, ${addr.state}` : ""} -->
    ${addr.state ? `<meta name="geo.region" content="US-${esc(addr.state)}" />` : ""}
    ${addr.city  ? `<meta name="geo.placename" content="${esc(addr.city)}${addr.state ? `, ${esc(addr.state)}` : ""}" />` : ""}

    <!-- Dublin Core -->
    <meta name="DC.title" content="${esc(name)}" />
    <meta name="DC.creator" content="${esc(name)}" />
    <meta name="DC.subject" content="${esc([typeName, addr.city].filter(Boolean).join(", "))}" />
    <meta name="DC.description" content="${esc(description)}" />
    <meta name="DC.publisher" content="${esc(name)}" />
    <meta name="DC.type" content="Service" />
    <meta name="DC.format" content="text/html" />
    <meta name="DC.language" content="en" />
    ${addr.city ? `<meta name="DC.coverage" content="${esc(addr.city)}${addr.state ? `, ${esc(addr.state)}` : ""}, USA" />` : ""}

    <!-- Business contact -->
    ${email ? `<meta name="contact" content="${esc(email)}" />
    <meta name="reply-to" content="${esc(email)}" />` : ""}

    <!-- Open Graph -->
    <meta property="og:type" content="${esc(ogType)}" />
    <meta property="og:title" content="${esc(pageTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonicalUrl)}" />
    <meta property="og:site_name" content="${esc(name)}" />
    <meta property="og:locale" content="en_US" />
    <meta http-equiv="content-language" content="en" />

    <!-- OG Business Contact -->
    ${addr.street ? `<meta property="business:contact_data:street_address" content="${esc(addr.street)}" />` : ""}
    ${addr.city   ? `<meta property="business:contact_data:locality" content="${esc(addr.city)}" />` : ""}
    ${addr.state  ? `<meta property="business:contact_data:region" content="${esc(addr.state)}" />` : ""}
    ${addr.zip    ? `<meta property="business:contact_data:postal_code" content="${esc(addr.zip)}" />` : ""}
    <meta property="business:contact_data:country_name" content="United States" />
    ${phone ? `<meta property="business:contact_data:phone_number" content="${esc(phone)}" />` : ""}
    <meta property="business:contact_data:website" content="${esc(canonicalUrl)}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(pageTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `.trim();

  return { title: pageTitle, meta };
}

// ── Generate llms.txt content ──────────────────────────────────────────────
function buildLlmsTxt(site: ClientSite, canonicalUrl: string): string {
  const name    = site.businessName || "Local Business";
  const desc    = site.description  || site.tagline || "";
  const phone   = site.phone        || "";
  const email   = site.email        || "";
  const address = site.address      || "";

  let services: { name: string; price?: string }[] = [];
  let hours: Record<string, string> = {};
  try { if (site.servicesJson) services = JSON.parse(site.servicesJson); } catch {}
  try { if (site.hoursJson)    hours    = JSON.parse(site.hoursJson);    } catch {}

  const lines: string[] = [
    `# ${name}`,
    "",
    `> ${desc}`,
    "",
    "## Business Information",
    `- Name: ${name}`,
    ...(phone   ? [`- Phone: ${phone}`]     : []),
    ...(email   ? [`- Email: ${email}`]     : []),
    ...(address ? [`- Address: ${address}`] : []),
    `- Website: ${canonicalUrl}`,
    "",
  ];

  if (services.length) {
    lines.push("## Services");
    services.forEach(s => lines.push(`- ${s.name}${s.price ? ` (${s.price})` : ""}`));
    lines.push("");
  }

  const hourEntries = Object.entries(hours).filter(([, v]) => v);
  if (hourEntries.length) {
    lines.push("## Hours");
    hourEntries.forEach(([day, val]) => lines.push(`- ${day.charAt(0).toUpperCase() + day.slice(1)}: ${val}`));
    lines.push("");
  }

  return lines.join("\n");
}

function notFoundPage(message: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f1e8}
.box{text-align:center;padding:3rem;background:white;border-radius:1.5rem;box-shadow:0 4px 24px rgba(0,0,0,.08)}
h1{font-size:1.5rem;font-weight:900;color:#0f172a;margin:0 0 .5rem}p{color:#64748b;margin:0}</style>
</head><body><div class="box"><h1>🚀 Launchsite</h1><p>${message}</p></div></body></html>`;
}

async function resolveClientSite(host: string): Promise<ClientSite | null> {
  const cleanHost = host.toLowerCase().replace(/:\d+$/, "");
  const subdomainSuffix = `.${MAIN_DOMAIN}`;
  if (cleanHost.endsWith(subdomainSuffix)) {
    const subdomain = cleanHost.slice(0, -subdomainSuffix.length);
    if (!subdomain) return null;
    const [site] = await db.select().from(clientSitesTable)
      .where(eq(clientSitesTable.subdomain, subdomain)).limit(1);
    return site ?? null;
  }
  const [site] = await db.select().from(clientSitesTable)
    .where(eq(clientSitesTable.customDomain, cleanHost)).limit(1);
  return site ?? null;
}

function serveAsset(urlPath: string, res: express.Response): boolean {
  const filePath = path.join(TEMPLATE_DIST, urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(path.resolve(filePath));
    return true;
  }
  return false;
}

function serveIndexWithSeo(site: ClientSite, canonicalUrl: string, res: express.Response): void {
  const indexPath = path.join(TEMPLATE_DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    res.status(503).send(notFoundPage("Template not yet built. Run deploy.sh first."));
    return;
  }
  const { title, meta } = buildSeoTags(site, canonicalUrl);
  let html = fs.readFileSync(indexPath, "utf-8");
  html = html.replace("<!--page-title-->", esc(title));
  html = html.replace("<!--seo-meta-->",   meta);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}

function getCanonicalUrl(req: express.Request): string {
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers.host}`;
}

// ── Routes ────────────────────────────────────────────────────────────────

// llms.txt — served at both /llms.txt and /.well-known/llms.txt
async function serveLlmsTxt(req: express.Request, res: express.Response): Promise<void> {
  const site = await resolveClientSite(req.headers.host || "");
  if (!site) { res.status(404).type("text/plain").send("# Not found"); return; }
  res.type("text/plain").send(buildLlmsTxt(site, getCanonicalUrl(req)));
}

app.get("/llms.txt",              serveLlmsTxt);
app.get("/.well-known/llms.txt",  serveLlmsTxt);

// All other requests
app.use(async (req, res) => {
  const host = req.headers.host || "";

  // Static assets (JS/CSS/images) — serve directly without a DB hit
  if (req.path !== "/" && serveAsset(req.path, res)) return;

  const site = await resolveClientSite(host);
  if (!site) { res.status(404).send(notFoundPage("No site found for this domain.")); return; }

  serveIndexWithSeo(site, getCanonicalUrl(req), res);
});

app.listen(PORT, () => {
  console.log(`[site-router] Listening on port ${PORT}`);
  console.log(`[site-router] Main domain: ${MAIN_DOMAIN}`);
  console.log(`[site-router] Template dist: ${TEMPLATE_DIST}`);
});
