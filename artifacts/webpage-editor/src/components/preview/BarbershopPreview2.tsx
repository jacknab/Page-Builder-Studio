import { useEffect } from "react";
import { getThemeById } from "./barbershop2/themes";
import type { ClientData } from "./barbershop2/types";
import { Navbar, Hero, Services, About, Reviews, BookingCTA, Contact, Footer } from "./barbershop2/Sections";

const DEMO: ClientData = {
  themeId: "urban-noir",
  businessName: "Sharp & Co.",
  tagline: "Sharp Cuts. Every Time.",
  description:
    "Sharp & Co. is a modern barbershop built for guys who care about how they look. We keep it simple — great cuts, on time, every time. No fuss, no waiting, just results.",
  phone: "(720) 555-0198",
  email: "hello@sharpandco.com",
  address: "88 Colfax Ave, Denver, CO 80203",
  established: 2019,
  bookingUrl: "#",
  services: [
    { name: "The Sharp Cut", price: "$40", duration: "30 min", category: "Haircut" },
    { name: "Fade", price: "$38", duration: "25 min", category: "Haircut" },
    { name: "Buzz Cut", price: "$25", duration: "15 min", category: "Haircut" },
    { name: "Kids Cut (under 12)", price: "$28", duration: "20 min", category: "Haircut" },
    { name: "Beard Trim", price: "$22", duration: "15 min", category: "Beard" },
    { name: "Beard Shape & Line", price: "$30", duration: "20 min", category: "Beard" },
    { name: "Cut + Beard Combo", price: "$58", duration: "45 min", category: "Combos" },
    { name: "Hot Towel Shave", price: "$45", duration: "35 min", category: "Shave" },
  ],
  reviews: [
    { name: "James T.", text: "Best fade I've ever had. These guys know exactly what they're doing.", rating: 5 },
    { name: "Marcus R.", text: "Walk in, walk out looking sharp. Every single time. My go-to shop.", rating: 5 },
    { name: "Derek W.", text: "Professional, fast, great atmosphere. Wouldn't go anywhere else.", rating: 5 },
  ],
  hours: {
    monday: "9:00 AM – 7:00 PM",
    tuesday: "9:00 AM – 7:00 PM",
    wednesday: "9:00 AM – 7:00 PM",
    thursday: "9:00 AM – 7:00 PM",
    friday: "9:00 AM – 6:00 PM",
    saturday: "10:00 AM – 5:00 PM",
    sunday: "Closed",
  },
  instagramUrl: "#",
  facebookUrl: "#",
};

export default function BarbershopPreview2({ themeId }: { themeId: string }) {
  const theme = getThemeById(themeId);
  const c = theme.colors;

  useEffect(() => {
    const families = [
      theme.fonts.heading.split(",")[0].trim().replace(/'/g, ""),
      theme.fonts.body.split(",")[0].trim().replace(/'/g, ""),
    ];
    [...new Set(families)].forEach((font) => {
      const id = `gfont-prev-bs2-${font.replace(/ /g, "-")}`;
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
        .bs2-preview h1,.bs2-preview h2,.bs2-preview h3,.bs2-preview h4 {
          font-family: ${theme.fonts.heading};
        }
      `}</style>
      <div className="bs2-preview">
        <Navbar theme={theme} clientData={DEMO} />
        <Hero theme={theme} clientData={DEMO} />
        <Services theme={theme} clientData={DEMO} />
        <About theme={theme} clientData={DEMO} />
        <Reviews theme={theme} clientData={DEMO} />
        <BookingCTA theme={theme} clientData={DEMO} />
        <Contact theme={theme} clientData={DEMO} />
        <Footer theme={theme} clientData={DEMO} />
      </div>
    </div>
  );
}
