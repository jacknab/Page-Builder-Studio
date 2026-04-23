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
    document.title = `${clientData.businessName} – ${clientData.tagline}`;
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
