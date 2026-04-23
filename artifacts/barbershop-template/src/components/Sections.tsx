import { Theme } from "../lib/themes";
import { ClientData, Service } from "../lib/types";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Scissors,
  Star,
  ChevronRight,
  Award,
  ExternalLink,
} from "lucide-react";

interface Props {
  theme: Theme;
  clientData: ClientData;
}

export function Navbar({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{ backgroundColor: c.navBg, borderBottom: `1px solid ${c.border}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <Scissors size={24} style={{ color: c.accent }} />
            <span
              className="text-lg md:text-xl font-bold"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              {clientData.businessName}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              ["#services", "Services"],
              ["#about", "About"],
              ["#hours", "Hours"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                {label}
              </a>
            ))}
          </div>
          {clientData.phone && (
            <a
              href={`tel:${clientData.phone}`}
              className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: c.buttonPrimary,
                color: c.badgeText,
                fontFamily: theme.fonts.heading,
              }}
            >
              {clientData.phone}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Hero({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${theme.heroImage})` }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: c.heroOverlay }} />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {clientData.established && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: c.accentLight,
              border: `1px solid ${c.accent}`,
            }}
          >
            <Award size={14} style={{ color: c.accent }} />
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: c.accent, fontFamily: theme.fonts.body }}
            >
              Est. {clientData.established}
            </span>
          </div>
        )}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ color: c.text, fontFamily: theme.fonts.heading }}
        >
          {clientData.businessName}
        </h1>
        <p
          className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
          style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
        >
          {clientData.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            style={{
              backgroundColor: c.buttonPrimary,
              color: c.badgeText,
              fontFamily: theme.fonts.heading,
            }}
          >
            View Services <ChevronRight size={20} />
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{
              backgroundColor: c.buttonSecondary,
              color: c.text,
              border: `2px solid ${c.border}`,
              fontFamily: theme.fonts.heading,
            }}
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}

function groupServices(services: Service[]): Record<string, Service[]> {
  const grouped: Record<string, Service[]> = {};
  for (const s of services) {
    const cat = s.category ?? "Services";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  }
  return grouped;
}

export function Services({ theme, clientData }: Props) {
  const c = theme.colors;
  const grouped = groupServices(clientData.services);
  const categories = Object.keys(grouped);

  return (
    <section id="services" className="py-20 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            What We Offer
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Our Services
          </h2>
          <div
            className="w-16 h-1 mx-auto rounded-full"
            style={{ backgroundColor: c.divider }}
          />
        </div>
        <div className="space-y-12">
          {categories.map((cat) => (
            <div key={cat}>
              {categories.length > 1 && (
                <h3
                  className="text-xl font-bold mb-6 pb-2 border-b-2 inline-block"
                  style={{
                    color: c.text,
                    fontFamily: theme.fonts.heading,
                    borderColor: c.accent,
                  }}
                >
                  {cat}
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[cat].map((item) => (
                  <div
                    key={item.name}
                    className="group p-5 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: c.card,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4
                          className="font-bold text-base mb-1"
                          style={{ color: c.text, fontFamily: theme.fonts.heading }}
                        >
                          {item.name}
                        </h4>
                        {item.description && (
                          <p
                            className="text-sm"
                            style={{
                              color: c.textSecondary,
                              fontFamily: theme.fonts.body,
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: c.priceTag, fontFamily: theme.fonts.heading }}
                        >
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About({ theme, clientData }: Props) {
  const c = theme.colors;
  const currentYear = new Date().getFullYear();
  const yearsOpen = clientData.established
    ? currentYear - clientData.established
    : null;

  return (
    <section id="about" className="py-20 px-4" style={{ backgroundColor: c.bgSecondary }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            Our Story
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            About Us
          </h2>
          <div
            className="w-16 h-1 mx-auto rounded-full"
            style={{ backgroundColor: c.divider }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
            >
              {clientData.description}
            </p>
            {clientData.established && (
              <p
                className="text-lg leading-relaxed"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                Proudly serving our community since {clientData.established}. Stop by or
                give us a call — we'd love to see you.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {yearsOpen !== null && (
              <div
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
              >
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: c.accent, fontFamily: theme.fonts.heading }}
                >
                  {yearsOpen}+
                </p>
                <p
                  className="text-sm"
                  style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                >
                  Years in Business
                </p>
              </div>
            )}
            <div
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: c.accent, fontFamily: theme.fonts.heading }}
              >
                {clientData.services.length}+
              </p>
              <p
                className="text-sm"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                Services Offered
              </p>
            </div>
            <div
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: c.accent, fontFamily: theme.fonts.heading }}
              >
                4.9
              </p>
              <p
                className="text-sm"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                Star Rating
              </p>
            </div>
            <div
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: c.accent, fontFamily: theme.fonts.heading }}
              >
                100%
              </p>
              <p
                className="text-sm"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                Satisfaction
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Marcus T.",
              text: "Best barbershop around — always a clean cut and a great atmosphere.",
              rating: 5,
            },
            {
              name: "David R.",
              text: "These guys know their craft. Never had a bad experience here.",
              rating: 5,
            },
            {
              name: "James L.",
              text: "I've been coming here for years. Skilled, professional, and friendly every time.",
              rating: 5,
            },
          ].map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-xl transition-all hover:scale-[1.02]"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={c.accent}
                    style={{ color: c.accent }}
                  />
                ))}
              </div>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                "{t.text}"
              </p>
              <p
                className="font-bold text-sm"
                style={{ color: c.text, fontFamily: theme.fonts.body }}
              >
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function Hours({ theme, clientData }: Props) {
  const c = theme.colors;
  const days = Object.entries(clientData.hours) as [string, string | undefined][];

  return (
    <section id="hours" className="py-20 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            When We're Open
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Business Hours
          </h2>
          <div
            className="w-16 h-1 mx-auto rounded-full"
            style={{ backgroundColor: c.divider }}
          />
        </div>
        <div className="space-y-3">
          {days.map(([day, time]) => (
            <div
              key={day}
              className="flex justify-between items-center p-5 rounded-xl"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <span
                className="font-semibold"
                style={{ color: c.text, fontFamily: theme.fonts.heading }}
              >
                {DAY_LABELS[day] ?? day}
              </span>
              <span
                className="font-mono"
                style={{
                  color:
                    time?.toLowerCase() === "closed" ? c.textSecondary : c.accent,
                  fontFamily: theme.fonts.body,
                }}
              >
                {time ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({ theme, clientData }: Props) {
  const c = theme.colors;
  const cards = [
    clientData.address && {
      Icon: MapPin,
      title: "Visit Us",
      value: clientData.address,
      href: clientData.googleUrl || `https://maps.google.com/?q=${encodeURIComponent(clientData.address)}`,
    },
    clientData.phone && {
      Icon: Phone,
      title: "Call Us",
      value: clientData.phone,
      href: `tel:${clientData.phone}`,
    },
    clientData.email && {
      Icon: Mail,
      title: "Email Us",
      value: clientData.email,
      href: `mailto:${clientData.email}`,
    },
  ].filter(Boolean) as {
    Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
    title: string;
    value: string;
    href: string;
  }[];

  return (
    <section id="contact" className="py-20 px-4" style={{ backgroundColor: c.bgSecondary }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            Get In Touch
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Contact Us
          </h2>
          <div
            className="w-16 h-1 mx-auto rounded-full"
            style={{ backgroundColor: c.divider }}
          />
        </div>
        <div
          className={`grid grid-cols-1 gap-6 ${
            cards.length === 2
              ? "md:grid-cols-2 max-w-2xl mx-auto"
              : cards.length === 3
              ? "md:grid-cols-3"
              : ""
          }`}
        >
          {cards.map(({ Icon, title, value, href }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="p-6 rounded-xl text-center transition-all hover:scale-[1.02] block"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <Icon size={28} className="mx-auto mb-3" style={{ color: c.accent }} />
              <h4
                className="font-bold mb-2"
                style={{ color: c.text, fontFamily: theme.fonts.heading }}
              >
                {title}
              </h4>
              <p
                className="text-sm"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                {value}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ theme, clientData }: Props) {
  const c = theme.colors;
  const socials = [
    clientData.instagramUrl && {
      Icon: Instagram,
      href: clientData.instagramUrl,
      label: "Instagram",
    },
    clientData.facebookUrl && {
      Icon: Facebook,
      href: clientData.facebookUrl,
      label: "Facebook",
    },
    clientData.yelpUrl && {
      Icon: ExternalLink,
      href: clientData.yelpUrl,
      label: "Yelp",
    },
  ].filter(Boolean) as {
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    href: string;
    label: string;
  }[];

  return (
    <footer className="py-12 px-4" style={{ backgroundColor: c.footerBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scissors size={20} style={{ color: c.accent }} />
              <span
                className="text-lg font-bold"
                style={{ color: c.footerText, fontFamily: theme.fonts.heading }}
              >
                {clientData.businessName}
              </span>
            </div>
            <p
              className="text-sm max-w-xs"
              style={{ color: c.footerText, opacity: 0.7, fontFamily: theme.fonts.body }}
            >
              {clientData.tagline}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {clientData.phone && (
              <a
                href={`tel:${clientData.phone}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                style={{ color: c.footerText, fontFamily: theme.fonts.body }}
              >
                <Phone size={14} style={{ color: c.accent }} />
                {clientData.phone}
              </a>
            )}
            {clientData.email && (
              <a
                href={`mailto:${clientData.email}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                style={{ color: c.footerText, fontFamily: theme.fonts.body }}
              >
                <Mail size={14} style={{ color: c.accent }} />
                {clientData.email}
              </a>
            )}
            {clientData.address && (
              <span
                className="flex items-center gap-2 text-sm"
                style={{ color: c.footerText, opacity: 0.7, fontFamily: theme.fonts.body }}
              >
                <MapPin size={14} style={{ color: c.accent }} />
                {clientData.address}
              </span>
            )}
          </div>
          {socials.length > 0 && (
            <div className="flex gap-4">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.accentLight,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <Icon size={18} style={{ color: c.accent }} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2"
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <p
            className="text-xs"
            style={{ color: c.footerText, opacity: 0.5, fontFamily: theme.fonts.body }}
          >
            © {new Date().getFullYear()} {clientData.businessName}. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: c.footerText, opacity: 0.4, fontFamily: theme.fonts.body }}
          >
            Built by Launchsite
          </p>
        </div>
      </div>
    </footer>
  );
}
