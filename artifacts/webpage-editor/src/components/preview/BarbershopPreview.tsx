import { useEffect } from "react";
import { getThemeById } from "./barbershop/themes";
import type { ClientData } from "./barbershop/types";
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
} from "./barbershop/Sections";

const DEMO: ClientData = {
  themeId: "midnight-gold",
  businessName: "Heritage Cuts",
  tagline: "Classic Cuts & Modern Style",
  description:
    "We've been shaping Denver's finest since 2010. Walk in, sit back, and leave looking sharper than you arrived. Every cut is crafted with care by our team of experienced barbers.",
  phone: "(303) 555-0147",
  email: "hello@heritagecuts.com",
  address: "420 Main Street, Denver, CO 80218",
  established: 2010,
  numberOfBarbers: 4,
  bookingUrl: "#",
  services: [
    { name: "Signature Cut", price: "$37", description: "Clippers on sides, scissor-cut top, hot lather neck shave.", popular: true },
    { name: "Cut & Beard Combo", price: "$55", description: "Full haircut plus beard trim. Hot lather neck shave included.", popular: true },
    { name: "Zero Fade", price: "$39", description: "Crisp zero fade with scissor or clipper top finish.", popular: true },
    { name: "Hot Towel Shave", price: "$40", description: "Traditional straight razor shave with hot towel treatment." },
    { name: "Kids Haircut", price: "$25", description: "Patient, friendly cuts for the little ones." },
    { name: "Beard Trim", price: "$20", description: "Clean shape and trim to keep your beard sharp." },
    { name: "Line Up / Edge Up", price: "$15", description: "Clean edge-up around hairline, temples, and neckline." },
  ],
  barbers: [
    { name: "Marcus", role: "Owner & Master Barber", yearsExp: 16, bio: "Cutting since 2008. Fades, tapers, and classic cuts are my specialty. Every client gets my full attention." },
    { name: "Jordan", role: "Senior Barber", yearsExp: 10, bio: "Precision fades and creative cuts. I love tackling the cuts other barbers won't touch." },
    { name: "Alex", role: "Barber", yearsExp: 7, bio: "Trained in New York, cutting in Denver. Fast, clean, consistent every time." },
    { name: "Sam", role: "Barber & Cosmetologist", yearsExp: 12, bio: "Double licensed. Specialising in textured hair and beard sculpting." },
  ],
  galleryImages: [
    "https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3993312/pexels-photo-3993312.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3993299/pexels-photo-3993299.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  hours: {
    monday: "9:00 AM – 7:00 PM",
    tuesday: "9:00 AM – 7:00 PM",
    wednesday: "9:00 AM – 7:00 PM",
    thursday: "9:00 AM – 7:00 PM",
    friday: "9:00 AM – 5:00 PM",
    saturday: "Closed",
    sunday: "10:00 AM – 6:00 PM",
  },
  googleUrl: "#",
  instagramUrl: "#",
  facebookUrl: "#",
};

export default function BarbershopPreview({ themeId }: { themeId: string }) {
  const theme = getThemeById(themeId);
  const c = theme.colors;

  useEffect(() => {
    const families = [
      theme.fonts.heading.split(",")[0].trim().replace(/'/g, ""),
      theme.fonts.body.split(",")[0].trim().replace(/'/g, ""),
    ];
    [...new Set(families)].forEach((font) => {
      const id = `gfont-prev-bs-${font.replace(/ /g, "-")}`;
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
        .bs-preview h1,.bs-preview h2,.bs-preview h3,.bs-preview h4,.bs-preview h5,.bs-preview h6 {
          font-family: ${theme.fonts.heading};
        }
      `}</style>
      <div className="bs-preview">
        <AnnouncementBar theme={theme} clientData={DEMO} />
        <Navbar theme={theme} clientData={DEMO} />
        <Hero theme={theme} clientData={DEMO} />
        <StatsBar theme={theme} clientData={DEMO} />
        <WhyChoose theme={theme} clientData={DEMO} />
        <Services theme={theme} clientData={DEMO} />
        <Gallery theme={theme} clientData={DEMO} />
        <Barbers theme={theme} clientData={DEMO} />
        <Location theme={theme} clientData={DEMO} />
        <Footer theme={theme} clientData={DEMO} />
      </div>
    </div>
  );
}
