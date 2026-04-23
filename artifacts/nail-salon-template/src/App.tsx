import { useState, useEffect } from "react";
import { getThemeById } from "./lib/themes";
import { ClientData } from "./lib/types";
import {
  Navbar,
  Hero,
  Services,
  Booking,
  About,
  Hours,
  Contact,
  Footer,
} from "./components/Sections";
import rawClientData from "./client-data.json";

const fallbackData = rawClientData as ClientData;

function getSlug(): string | null {
  try {
    const host = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    const paramSlug = params.get("slug");
    if (paramSlug) return paramSlug;
    const parts = host.split(".");
    if (parts.length >= 3) return parts[0];
    return null;
  } catch {
    return null;
  }
}

function getInitialThemeId(data: ClientData): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("theme") || data.themeId;
  } catch {
    return data.themeId;
  }
}

function applyFonts(headingFont: string, bodyFont: string) {
  const families = [
    headingFont.split(",")[0].trim().replace(/'/g, ""),
    bodyFont.split(",")[0].trim().replace(/'/g, ""),
  ];
  [...new Set(families)].forEach((font) => {
    const id = `gfont-${font.replace(/ /g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
    document.head.appendChild(link);
  });
}

function setMeta(name: string, content: string, attr = "name") {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const sel = extra ? Object.entries(extra).map(([k, v]) => `[${k}="${v}"]`).join("") : "";
  let el = document.querySelector(`link[rel="${rel}"]${sel}`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function parseAddr(raw: string) {
  const m = raw.match(/^(.+?),\s*(.+?),\s*([A-Z]{2})\s*(\d{5})?/);
  return m
    ? { street: m[1].trim(), city: m[2].trim(), state: m[3], zip: m[4] || "" }
    : { street: raw, city: "", state: "", zip: "" };
}

function injectSeo(data: ClientData) {
  const name        = data.businessName || "";
  const description = (data.description || data.tagline || `${name} — professional services.`).slice(0, 160);
  const addr        = parseAddr(data.address || "");
  const canonicalUrl = window.location.origin;
  const pageTitle   = addr.city ? `${name} | ${addr.city}` : name;

  const typeMap: Record<string, string> = {
    "nail-salon": "NailSalon", "barbershop": "BarberShop", "hair-salon": "HairSalon",
  };
  const schemaType = typeMap[data.businessType || ""] || "LocalBusiness";
  const typeName   = schemaType.replace(/([A-Z])/g, " $1").trim();

  const svcKeywords = data.services?.slice(0, 8).map(s => s.name).join(", ") || "";
  const keywords = [name, addr.city, addr.state, typeName, svcKeywords,
    `${typeName} near me`, `best ${typeName} ${addr.city}`,
  ].filter(Boolean).join(", ");

  // Primary
  document.title = pageTitle;
  setMeta("description",   description);
  setMeta("keywords",      keywords);
  setMeta("author",        name);
  setMeta("robots",        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  setMeta("googlebot",     "index, follow");
  setMeta("abstract",      description);
  setMeta("rating",        "5 stars");
  setMeta("revisit-after", "7 days");
  setMeta("distribution",  "global");
  setLink("canonical", canonicalUrl);

  // LLM / AI Search
  setLink("alternate", `${canonicalUrl}/llms.txt`, { type: "text/plain", title: "LLM Information" });
  setMeta("ai-content-declaration", "human-created");

  // Geo
  if (addr.state) setMeta("geo.region",    `US-${addr.state}`);
  if (addr.city)  setMeta("geo.placename", `${addr.city}${addr.state ? `, ${addr.state}` : ""}`);

  // Dublin Core
  setMeta("DC.title",       name);
  setMeta("DC.creator",     name);
  setMeta("DC.subject",     [typeName, addr.city].filter(Boolean).join(", "));
  setMeta("DC.description", description);
  setMeta("DC.publisher",   name);
  setMeta("DC.type",        "Service");
  setMeta("DC.format",      "text/html");
  setMeta("DC.language",    "en");
  if (addr.city) setMeta("DC.coverage", `${addr.city}${addr.state ? `, ${addr.state}` : ""}, USA`);

  // Business contact
  if (data.email) { setMeta("contact", data.email); setMeta("reply-to", data.email); }

  // Open Graph
  const ogType = data.businessType ? "business.business" : "local.business";
  setMeta("og:type",        ogType,        "property");
  setMeta("og:title",       pageTitle,     "property");
  setMeta("og:description", description,   "property");
  setMeta("og:url",         canonicalUrl,  "property");
  setMeta("og:site_name",   name,          "property");
  setMeta("og:locale",      "en_US",       "property");

  // OG Business Contact
  if (addr.street) setMeta("business:contact_data:street_address", addr.street, "property");
  if (addr.city)   setMeta("business:contact_data:locality",       addr.city,   "property");
  if (addr.state)  setMeta("business:contact_data:region",         addr.state,  "property");
  if (addr.zip)    setMeta("business:contact_data:postal_code",    addr.zip,    "property");
  setMeta("business:contact_data:country_name", "United States", "property");
  if (data.phone) setMeta("business:contact_data:phone_number", data.phone, "property");
  setMeta("business:contact_data:website", canonicalUrl, "property");

  // Twitter
  setMeta("twitter:card",        "summary_large_image");
  setMeta("twitter:title",       pageTitle);
  setMeta("twitter:description", description);

  // JSON-LD
  document.querySelectorAll('script[data-launchsite-ld]').forEach(el => el.remove());
  const sameAs = [data.googleUrl, data.instagramUrl, data.facebookUrl, data.tiktokUrl, data.yelpUrl].filter(Boolean);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": name,
    "description": description,
    "url": canonicalUrl,
    ...(data.phone ? { "telephone": data.phone } : {}),
    ...(data.email ? { "email": data.email }     : {}),
    ...(data.address ? { "address": {
      "@type": "PostalAddress",
      "streetAddress": addr.street,
      ...(addr.city  ? { "addressLocality": addr.city }  : {}),
      ...(addr.state ? { "addressRegion":   addr.state } : {}),
      ...(addr.zip   ? { "postalCode":      addr.zip }   : {}),
      "addressCountry": "US",
    }} : {}),
    ...(data.services?.length ? { "hasOfferCatalog": {
      "@type": "OfferCatalog", "name": "Services",
      "itemListElement": data.services.slice(0, 10).map((s, i) => ({
        "@type": "Offer", "position": i + 1,
        "itemOffered": { "@type": "Service", "name": s.name },
      })),
    }} : {}),
    ...(sameAs.length ? { "sameAs": sameAs } : {}),
    "priceRange": "$$",
  };
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.setAttribute("data-launchsite-ld", "1");
  ld.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(ld);
}

export default function App() {
  const [clientData, setClientData] = useState<ClientData>(fallbackData);
  const [themeId, setThemeId] = useState(() => getInitialThemeId(fallbackData));
  const theme = getThemeById(themeId);

  useEffect(() => {
    const slug = getSlug();
    if (!slug) return;
    fetch(`/api/sites/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ClientData | null) => {
        if (!data) return;
        setClientData(data);
        setThemeId(getInitialThemeId(data));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    applyFonts(theme.fonts.heading, theme.fonts.body);
    injectSeo(clientData);
  }, [theme, clientData]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "SET_THEME" && typeof e.data.themeId === "string") {
        setThemeId(e.data.themeId);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const c = theme.colors;

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      <style>{`
        * { font-family: ${theme.fonts.body}; }
        h1,h2,h3,h4,h5,h6,.font-heading { font-family: ${theme.fonts.heading}; }
        ::selection { background: ${c.accent}; color: ${c.badgeText}; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${c.bgSecondary}; }
        ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.accent}; }
        html { scroll-behavior: smooth; }
      `}</style>
      <Navbar theme={theme} clientData={clientData} />
      <Hero theme={theme} clientData={clientData} />
      <Services theme={theme} clientData={clientData} />
      <Booking theme={theme} clientData={clientData} />
      <About theme={theme} clientData={clientData} />
      <Hours theme={theme} clientData={clientData} />
      <Contact theme={theme} clientData={clientData} />
      <Footer theme={theme} clientData={clientData} />
    </div>
  );
}
