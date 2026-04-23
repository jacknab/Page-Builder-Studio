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

// ── Schema.org type mapping ────────────────────────────────────────────────
function schemaType(businessType: string | null | undefined): string {
  switch (businessType) {
    case "nail-salon":  return "NailSalon";
    case "barbershop":  return "BarberShop";
    case "hair-salon":  return "HairSalon";
    default:            return "LocalBusiness";
  }
}

// ── Build all SEO <head> tags from site data ───────────────────────────────
function buildSeoTags(site: ClientSite, canonicalUrl: string): { title: string; meta: string } {
  const name        = site.businessName  || "Local Business";
  const tagline     = site.tagline       || "";
  const description = site.description  || tagline || `${name} — professional services.`;
  const phone       = site.phone         || "";
  const email       = site.email         || "";
  const address     = site.address       || "";
  const type        = schemaType(site.businessType);

  // Parse city from address for title enrichment
  const cityMatch = address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
  const city = cityMatch ? cityMatch[1].trim() : "";

  const pageTitle = city
    ? `${name} | ${city}`
    : name;

  const metaDescription = description.slice(0, 160);

  // Parse services list for keywords
  let services: { name: string }[] = [];
  try { if (site.servicesJson) services = JSON.parse(site.servicesJson); } catch {}
  const serviceKeywords = services.slice(0, 6).map((s) => s.name).join(", ");
  const keywords = [name, city, type.replace(/([A-Z])/g, " $1").trim(), serviceKeywords]
    .filter(Boolean).join(", ");

  // Parse hours for JSON-LD
  let hours: Record<string, string> = {};
  try { if (site.hoursJson) hours = JSON.parse(site.hoursJson); } catch {}
  const dayMap: Record<string, string> = {
    monday: "Mo", tuesday: "Tu", wednesday: "We", thursday: "Th",
    friday: "Fr", saturday: "Sa", sunday: "Su",
  };
  const openingHours = Object.entries(hours)
    .filter(([, val]) => val && val.toLowerCase() !== "closed")
    .map(([day, val]) => {
      const abbr = dayMap[day.toLowerCase()] || day.slice(0, 2);
      // Convert "9:00 AM - 7:00 PM" → "09:00-19:00"
      const times = val.match(/(\d+:\d+)\s*(AM|PM)?\s*[-–]\s*(\d+:\d+)\s*(AM|PM)?/i);
      if (!times) return null;
      const to24 = (t: string, period: string) => {
        const [h, m] = t.split(":").map(Number);
        const h24 = period?.toUpperCase() === "PM" && h !== 12 ? h + 12
                   : period?.toUpperCase() === "AM" && h === 12 ? 0 : h;
        return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      };
      return `${abbr} ${to24(times[1], times[2])}-${to24(times[3], times[4])}`;
    })
    .filter(Boolean);

  // JSON-LD LocalBusiness structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
    "description": metaDescription,
    "url": canonicalUrl,
    ...(phone    ? { "telephone": phone }                     : {}),
    ...(email    ? { "email": email }                         : {}),
    ...(address  ? { "address": {
        "@type": "PostalAddress",
        "streetAddress": address,
      }} : {}),
    ...(openingHours.length ? { "openingHours": openingHours } : {}),
    ...(services.length ? {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": services.slice(0, 10).map((s, i) => ({
          "@type": "Offer",
          "position": i + 1,
          "itemOffered": { "@type": "Service", "name": s.name },
        })),
      },
    } : {}),
    ...(site.googleUrl   ? { "sameAs": [site.googleUrl, site.instagramUrl, site.facebookUrl].filter(Boolean) } : {}),
    "priceRange": "$$",
  };

  const meta = `
    <meta name="description" content="${escape(metaDescription)}" />
    <meta name="keywords" content="${escape(keywords)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="local.business" />
    <meta property="og:title" content="${escape(pageTitle)}" />
    <meta property="og:description" content="${escape(metaDescription)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${escape(name)}" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escape(pageTitle)}" />
    <meta name="twitter:description" content="${escape(metaDescription)}" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `.trim();

  return { title: pageTitle, meta };
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

// ── Serve a static asset from the template dist ───────────────────────────
function serveAsset(urlPath: string, res: express.Response): boolean {
  const filePath = path.join(TEMPLATE_DIST, urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(path.resolve(filePath));
    return true;
  }
  return false;
}

// ── Read index.html and inject SEO tags ───────────────────────────────────
function serveIndexWithSeo(site: ClientSite, canonicalUrl: string, res: express.Response): void {
  const indexPath = path.join(TEMPLATE_DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    res.status(503).send(notFoundPage("Template not yet built. Run deploy.sh first."));
    return;
  }

  const { title, meta } = buildSeoTags(site, canonicalUrl);
  let html = fs.readFileSync(indexPath, "utf-8");
  html = html.replace("<!--page-title-->", escape(title));
  html = html.replace("<!--seo-meta-->",   meta);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}

// ── Request handler ────────────────────────────────────────────────────────
app.use(async (req, res) => {
  const host = req.headers.host || "";

  // Serve static assets (JS/CSS/images) directly without a DB lookup
  if (req.path !== "/" && serveAsset(req.path, res)) return;

  // Resolve site from DB
  const site = await resolveClientSite(host);
  if (!site) {
    res.status(404).send(notFoundPage("No site found for this domain."));
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const canonicalUrl = `${protocol}://${host}`;
  serveIndexWithSeo(site, canonicalUrl, res);
});

app.listen(PORT, () => {
  console.log(`[site-router] Listening on port ${PORT}`);
  console.log(`[site-router] Main domain: ${MAIN_DOMAIN}`);
  console.log(`[site-router] Template dist: ${TEMPLATE_DIST}`);
});
