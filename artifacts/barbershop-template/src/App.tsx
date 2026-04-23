import { useState, useEffect } from "react";
import { getThemeById } from "./lib/themes";
import { ClientData } from "./lib/types";
import {
  AnnouncementBar,
  Navbar,
  Hero,
  StatsBar,
  WhyChoose,
  Services,
  Gallery,
  Barbers,
  Location,
  Footer,
} from "./components/Sections";
import rawClientData from "./client-data.json";

const clientData = rawClientData as ClientData;

function getInitialThemeId(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("theme") || clientData.themeId;
  } catch {
    return clientData.themeId;
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
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  });
}

export default function App() {
  const [themeId, setThemeId] = useState(getInitialThemeId);
  const theme = getThemeById(themeId);

  useEffect(() => {
    applyFonts(theme.fonts.heading, theme.fonts.body);
    document.title = `${clientData.businessName} – ${clientData.tagline}`;
  }, [theme]);

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
      <AnnouncementBar theme={theme} clientData={clientData} />
      <Navbar theme={theme} clientData={clientData} />
      <Hero theme={theme} clientData={clientData} />
      <StatsBar theme={theme} clientData={clientData} />
      <WhyChoose theme={theme} clientData={clientData} />
      <Services theme={theme} clientData={clientData} />
      <Gallery theme={theme} clientData={clientData} />
      <Barbers theme={theme} clientData={clientData} />
      <Location theme={theme} clientData={clientData} />
      <Footer theme={theme} clientData={clientData} />
    </div>
  );
}
