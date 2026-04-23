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

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
  el.setAttribute("href", href);
}

function injectSeo(data: ClientData) {
  const name        = data.businessName  || "";
  const description = (data.description || data.tagline || `${name} — professional services.`).slice(0, 160);
  const address     = data.address || "";
  const cityMatch   = address.match(/,\s*([^,]+),\s*[A-Z]{2}/);
  const city        = cityMatch ? cityMatch[1].trim() : "";
  const pageTitle   = city ? `${name} | ${city}` : name;
  const canonicalUrl = window.location.origin;

  // Primary
  document.title = pageTitle;
  setMeta("description", description);
  setMeta("robots", "index, follow");
  setLink("canonical", canonicalUrl);

  // Open Graph
  setMeta("og:type",        "local.business",  "property");
  setMeta("og:title",       pageTitle,          "property");
  setMeta("og:description", description,        "property");
  setMeta("og:url",         canonicalUrl,       "property");
  setMeta("og:site_name",   name,               "property");
  setMeta("og:locale",      "en_US",            "property");

  // Twitter Card
  setMeta("twitter:card",        "summary");
  setMeta("twitter:title",       pageTitle);
  setMeta("twitter:description", description);

  // JSON-LD — remove any previous injection first
  document.querySelectorAll('script[data-launchsite-ld]').forEach((el) => el.remove());
  const typeMap: Record<string, string> = {
    "nail-salon": "NailSalon", "barbershop": "BarberShop", "hair-salon": "HairSalon",
  };
  const schemaType = typeMap[data.businessType || ""] || "LocalBusiness";
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": name,
    "description": description,
    "url": canonicalUrl,
    ...(data.phone   ? { "telephone": data.phone }   : {}),
    ...(data.email   ? { "email":     data.email }    : {}),
    ...(address      ? { "address":   { "@type": "PostalAddress", "streetAddress": address } } : {}),
    ...(data.services?.length ? {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": data.services.slice(0, 10).map((s, i) => ({
          "@type": "Offer", "position": i + 1,
          "itemOffered": { "@type": "Service", "name": s.name },
        })),
      },
    } : {}),
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
