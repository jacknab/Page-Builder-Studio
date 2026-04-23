import { useEffect } from "react";
import { getThemeById } from "./lib/themes";
import { ClientData } from "./lib/types";
import {
  Navbar,
  Hero,
  Services,
  About,
  Hours,
  Contact,
  Footer,
} from "./components/Sections";
import rawClientData from "./client-data.json";

const clientData = rawClientData as ClientData;
const theme = getThemeById(clientData.themeId);

function applyFonts() {
  const families = [
    theme.fonts.heading.split(",")[0].trim().replace(/'/g, ""),
    theme.fonts.body.split(",")[0].trim().replace(/'/g, ""),
  ];
  const unique = [...new Set(families)];
  unique.forEach((font) => {
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
  useEffect(() => {
    applyFonts();
    document.title = `${clientData.businessName} – ${clientData.tagline}`;
  }, []);

  const c = theme.colors;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
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
      <About theme={theme} clientData={clientData} />
      <Hours theme={theme} clientData={clientData} />
      <Contact theme={theme} clientData={clientData} />
      <Footer theme={theme} clientData={clientData} />
    </div>
  );
}
