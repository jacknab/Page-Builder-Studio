import { useEffect } from "react";
import { getThemeById } from "./nail-salon/themes";
import type { ClientData } from "./nail-salon/types";
import {
  Navbar,
  Hero,
  Services,
  About,
  Hours,
  Contact,
  Footer,
} from "./nail-salon/Sections";

const DEMO: ClientData = {
  themeId: "rose-quartz",
  businessName: "Luxe Nail Studio",
  tagline: "Where Nails Become Art",
  description:
    "A premium nail salon offering meticulous care, stunning designs, and a relaxing atmosphere. Our expert technicians bring years of experience to every service.",
  phone: "(720) 555-0192",
  email: "hello@luxenailstudio.com",
  address: "512 Pearl Street, Boulder, CO 80302",
  established: 2018,
  teamSize: 6,
  services: [
    { name: "Gel Manicure", price: "$45", category: "Manicure" },
    { name: "Acrylic Full Set", price: "$70", category: "Manicure" },
    { name: "Spa Pedicure", price: "$65", category: "Pedicure" },
    { name: "Regular Manicure", price: "$30", category: "Manicure" },
    { name: "Gel Pedicure", price: "$55", category: "Pedicure" },
    { name: "French Tips", price: "$40", category: "Manicure" },
    { name: "Nail Art (per nail)", price: "$5+", category: "Add-on" },
    { name: "Nail Repair", price: "$10", category: "Add-on" },
  ],
  hours: {
    monday: "9:00 AM – 7:00 PM",
    tuesday: "9:00 AM – 7:00 PM",
    wednesday: "9:00 AM – 7:00 PM",
    thursday: "9:00 AM – 7:00 PM",
    friday: "9:00 AM – 6:00 PM",
    saturday: "9:00 AM – 5:00 PM",
    sunday: "Closed",
  },
  googleUrl: "#",
  instagramUrl: "#",
  facebookUrl: "#",
};

export default function NailSalonPreview({ themeId }: { themeId: string }) {
  const theme = getThemeById(themeId);
  const c = theme.colors;

  useEffect(() => {
    const families = [
      theme.fonts.heading.split(",")[0].trim().replace(/'/g, ""),
      theme.fonts.body.split(",")[0].trim().replace(/'/g, ""),
    ];
    [...new Set(families)].forEach((font) => {
      const id = `gfont-prev-ns-${font.replace(/ /g, "-")}`;
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    });
  }, [theme]);

  return (
    <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: theme.fonts.body }}>
      <style>{`
        .ns-preview h1,.ns-preview h2,.ns-preview h3,.ns-preview h4,.ns-preview h5,.ns-preview h6 {
          font-family: ${theme.fonts.heading};
        }
      `}</style>
      <div className="ns-preview">
        <Navbar theme={theme} clientData={DEMO} />
        <Hero theme={theme} clientData={DEMO} />
        <About theme={theme} clientData={DEMO} />
        <Services theme={theme} clientData={DEMO} />
        <Hours theme={theme} clientData={DEMO} />
        <Contact theme={theme} clientData={DEMO} />
        <Footer theme={theme} clientData={DEMO} />
      </div>
    </div>
  );
}
