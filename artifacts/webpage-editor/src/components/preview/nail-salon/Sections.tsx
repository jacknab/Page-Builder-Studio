import { Theme } from "./themes";
import { ClientData, Service } from "./types";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Star,
  ChevronRight,
  Award,
  ExternalLink,
  CalendarCheck,
  Sparkles,
  Check,
} from "lucide-react";
import BookingWidget from "./BookingWidget";
import { SiteContent } from "@/lib/siteContent";

interface Props {
  theme: Theme;
  clientData: ClientData;
  content?: SiteContent;
}

/* ─── Navbar ─── */
export function Navbar({ theme, clientData, content }: Props) {
  const c = theme.colors;
  const hasBooking = !!(clientData.bookingSlug && clientData.bookingDomain);
  return (
    <nav
      className="sticky top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{ backgroundColor: c.navBg, borderBottom: `1px solid ${c.border}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2.5">
            <Sparkles size={20} style={{ color: c.accent }} />
            <span
              className="text-lg md:text-xl font-bold tracking-wide"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              {clientData.businessName}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              ["#services", "Services"],
              ["#booking", hasBooking ? "Book Online" : "Book"],
              ["#about", "About"],
              ["#hours", "Hours"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="#booking"
            className="px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: c.buttonPrimary,
              color: c.badgeText,
              fontFamily: theme.fonts.body,
            }}
          >
            {content?.navbarCta ?? (hasBooking ? "Book Now" : "Get In Touch")}
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
export function Hero({ theme, clientData, content }: Props) {
  const c = theme.colors;
  const hasBooking = !!(clientData.bookingSlug && clientData.bookingDomain);

  const trustItems = [
    content?.heroTrust1 ?? (hasBooking ? "Book Online" : "Walk-ins Welcome"),
    content?.heroTrust2 ?? (clientData.established ? `Est. ${clientData.established}` : "Expert Team"),
    content?.heroTrust3 ?? (clientData.teamSize ? `${clientData.teamSize} Nail Artists` : "5-Star Service"),
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${theme.heroImage})` }}
      />
      {/* Base dark layer — always ensures readability */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.52)" }} />
      {/* Theme colour tint on top */}
      <div className="absolute inset-0" style={{ backgroundColor: c.heroOverlay }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-32 md:py-40">

        {/* Location / status badge */}
        {clientData.address && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: c.accent }}
            />
            <span
              className="text-xs font-semibold text-white/80 tracking-wide"
              style={{ fontFamily: theme.fonts.body }}
            >
              {clientData.address}
            </span>
          </div>
        )}

        {/* Two-tone heading */}
        <h1
          className="mb-6 leading-[1.06] font-bold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          <span className="block text-5xl sm:text-6xl md:text-7xl text-white">
            {clientData.businessName}
          </span>
          <span
            className="block text-5xl sm:text-6xl md:text-7xl"
            style={{ color: c.accent }}
          >
            {clientData.tagline}
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-base md:text-lg mb-8 max-w-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.72)", fontFamily: theme.fonts.body }}
        >
          {clientData.description}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
          {trustItems.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.80)", fontFamily: theme.fonts.body }}
            >
              <Check size={14} style={{ color: c.accent }} />
              {item}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: c.buttonPrimary,
              color: c.badgeText,
              fontFamily: theme.fonts.body,
            }}
          >
            {content?.heroCtaPrimary ?? (hasBooking ? "Book Your Appointment" : "View Services")}
            <ChevronRight size={18} />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105"
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              color: "#ffffff",
              border: "1.5px solid rgba(255,255,255,0.30)",
              fontFamily: theme.fonts.body,
            }}
          >
            {content?.heroCtaSecondary ?? "Our Services"}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
function groupServices(services: Service[]): Record<string, Service[]> {
  const grouped: Record<string, Service[]> = {};
  for (const s of services) {
    const cat = s.category ?? "Services";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  }
  return grouped;
}

export function Services({ theme, clientData, content }: Props) {
  const c = theme.colors;
  const grouped = groupServices(clientData.services);
  const categories = Object.keys(grouped);

  return (
    <section id="services" className="py-24 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            {content?.servicesEyebrow ?? "Our Menu"}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            {content?.servicesTitle ?? "Services & Pricing"}
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: c.divider }} />
        </div>
        <div className="space-y-14">
          {categories.map((cat) => (
            <div key={cat}>
              {categories.length > 1 && (
                <div className="flex items-center gap-4 mb-6">
                  <h3
                    className="text-lg font-bold uppercase tracking-widest"
                    style={{ color: c.accent, fontFamily: theme.fonts.body }}
                  >
                    {cat}
                  </h3>
                  <div className="flex-1 h-px" style={{ backgroundColor: c.border }} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grouped[cat].map((item) => (
                  <div
                    key={item.name}
                    className="group flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: c.card,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-base"
                        style={{ color: c.text, fontFamily: theme.fonts.body }}
                      >
                        {item.name}
                      </h4>
                      {item.description && (
                        <p
                          className="text-sm mt-0.5 truncate"
                          style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="ml-6 shrink-0 text-xl font-bold"
                      style={{ color: c.priceTag, fontFamily: theme.fonts.heading }}
                    >
                      {item.price}
                    </span>
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

/* ─── Booking ─── */
export function Booking({ theme, clientData }: Props) {
  const c = theme.colors;
  const hasBooking = !!(clientData.bookingSlug && clientData.bookingDomain);

  return (
    <section
      id="booking"
      className="py-24 px-4"
      style={{ backgroundColor: c.bgSecondary }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            Reservations
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            {hasBooking ? "Book Your Visit" : "Ready to Visit Us?"}
          </h2>
          <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: c.divider }} />
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
          >
            {hasBooking
              ? "Choose your service, pick a time, and we'll take care of the rest."
              : "Give us a call or stop by — we'd love to see you."}
          </p>
        </div>

        {hasBooking ? (
          <div
            className="rounded-3xl p-6 md:p-8"
            style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
          >
            <BookingWidget
              theme={theme}
              bookingSlug={clientData.bookingSlug!}
              bookingDomain={clientData.bookingDomain!}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {clientData.phone && (
              <a
                href={`tel:${clientData.phone}`}
                className="flex flex-col items-center gap-4 p-8 rounded-3xl text-center transition-all hover:scale-[1.02]"
                style={{ backgroundColor: c.card, border: `2px solid ${c.border}` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c.accentLight }}
                >
                  <Phone size={24} style={{ color: c.accent }} />
                </div>
                <div>
                  <p
                    className="font-bold text-lg mb-1"
                    style={{ color: c.text, fontFamily: theme.fonts.heading }}
                  >
                    Call to Book
                  </p>
                  <p style={{ color: c.accent, fontFamily: theme.fonts.body }}>
                    {clientData.phone}
                  </p>
                </div>
              </a>
            )}
            <div
              className="flex flex-col items-center gap-4 p-8 rounded-3xl text-center"
              style={{ backgroundColor: c.card, border: `2px solid ${c.border}` }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: c.accentLight }}
              >
                <CalendarCheck size={24} style={{ color: c.accent }} />
              </div>
              <div>
                <p
                  className="font-bold text-lg mb-1"
                  style={{ color: c.text, fontFamily: theme.fonts.heading }}
                >
                  Walk-Ins Welcome
                </p>
                <p
                  className="text-sm"
                  style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                >
                  Come in anytime during business hours
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── About ─── */
export function About({ theme, clientData, content }: Props) {
  const c = theme.colors;
  const currentYear = new Date().getFullYear();
  const yearsOpen = clientData.established ? currentYear - clientData.established : null;

  const stats = [
    yearsOpen !== null ? { value: `${yearsOpen}+`, label: "Years of Excellence" } : null,
    clientData.teamSize ? { value: clientData.teamSize, label: "Nail Artists" } : null,
    clientData.services.length > 0
      ? { value: `${clientData.services.length}+`, label: "Services Offered" }
      : null,
    { value: "4.9★", label: "Star Rating" },
  ].filter(Boolean) as { value: string | number; label: string }[];

  const reviews = content?.reviews ?? [
    {
      name: "Sophia M.",
      text: "Absolutely stunning work. My gel nails have never looked this good — they lasted over three weeks without a chip.",
      rating: 5,
    },
    {
      name: "Olivia R.",
      text: "The atmosphere is so relaxing and the technicians really take their time. I leave feeling pampered every visit.",
      rating: 5,
    },
    {
      name: "Isabella K.",
      text: "Best nail salon in the area. The nail art they do is incredible — I get compliments everywhere I go.",
      rating: 5,
    },
  ];

  return (
    <section id="about" className="py-24 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            {content?.aboutEyebrow ?? "Our Story"}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            {content?.aboutTitle ?? "About Us"}
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: c.divider }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-20">
          <div>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
            >
              {clientData.description}
            </p>
            {clientData.established && (
              <p
                className="text-base leading-relaxed"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                Proudly serving our community since {clientData.established}. We invite you to
                sit back, relax, and leave with nails you love.
              </p>
            )}
          </div>
          <div
            className={`grid gap-4 ${
              stats.length <= 2
                ? "grid-cols-2"
                : stats.length === 3
                ? "grid-cols-3"
                : "grid-cols-2"
            }`}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
              >
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: c.accent, fontFamily: theme.fonts.heading }}
                >
                  {value}
                </p>
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="p-7 rounded-2xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={15} fill={c.accent} style={{ color: c.accent }} />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-5 italic"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.heading }}
              >
                "{r.text}"
              </p>
              <p
                className="font-semibold text-sm"
                style={{ color: c.text, fontFamily: theme.fonts.body }}
              >
                — {r.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Hours ─── */
const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function Hours({ theme, clientData, content }: Props) {
  const c = theme.colors;
  const days = Object.entries(clientData.hours) as [string, string | undefined][];

  return (
    <section id="hours" className="py-24 px-4" style={{ backgroundColor: c.bgSecondary }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            {content?.hoursEyebrow ?? "We're Open"}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            {content?.hoursTitle ?? "Hours"}
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: c.divider }} />
        </div>
        <div
          className="rounded-3xl overflow-hidden"
          style={{ border: `1px solid ${c.border}` }}
        >
          {days.map(([day, time], i) => (
            <div
              key={day}
              className="flex justify-between items-center px-6 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? c.card : c.bg,
                borderBottom: i < days.length - 1 ? `1px solid ${c.border}` : "none",
              }}
            >
              <span
                className="font-medium text-sm"
                style={{ color: c.text, fontFamily: theme.fonts.body }}
              >
                {DAY_LABELS[day] ?? day}
              </span>
              <span
                className="font-semibold text-sm"
                style={{
                  color: time?.toLowerCase() === "closed" ? c.textSecondary : c.accent,
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

/* ─── Contact ─── */
export function Contact({ theme, clientData, content }: Props) {
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
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    title: string;
    value: string;
    href: string;
  }[];

  return (
    <section id="contact" className="py-24 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            {content?.contactEyebrow ?? "Find Us"}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            {content?.contactTitle ?? "Get In Touch"}
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: c.divider }} />
        </div>
        <div
          className={`grid grid-cols-1 gap-5 ${
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
              className="flex flex-col items-center p-8 rounded-2xl text-center transition-all hover:scale-[1.02] block"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: c.accentLight }}
              >
                <Icon size={22} style={{ color: c.accent }} />
              </div>
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

/* ─── Footer ─── */
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
    clientData.tiktokUrl && {
      Icon: ExternalLink,
      href: clientData.tiktokUrl,
      label: "TikTok",
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
    <footer className="py-14 px-4" style={{ backgroundColor: c.footerBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} style={{ color: c.accent }} />
              <span
                className="text-lg font-bold"
                style={{ color: c.footerText, fontFamily: theme.fonts.heading }}
              >
                {clientData.businessName}
              </span>
            </div>
            <p
              className="text-sm max-w-xs italic"
              style={{ color: c.footerText, opacity: 0.65, fontFamily: theme.fonts.heading }}
            >
              {clientData.tagline}
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {clientData.phone && (
              <a
                href={`tel:${clientData.phone}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                style={{ color: c.footerText, fontFamily: theme.fonts.body }}
              >
                <Phone size={13} style={{ color: c.accent }} />
                {clientData.phone}
              </a>
            )}
            {clientData.email && (
              <a
                href={`mailto:${clientData.email}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                style={{ color: c.footerText, fontFamily: theme.fonts.body }}
              >
                <Mail size={13} style={{ color: c.accent }} />
                {clientData.email}
              </a>
            )}
            {clientData.address && (
              <span
                className="flex items-center gap-2 text-sm"
                style={{ color: c.footerText, opacity: 0.65, fontFamily: theme.fonts.body }}
              >
                <MapPin size={13} style={{ color: c.accent }} />
                {clientData.address}
              </span>
            )}
          </div>
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.accentLight,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <Icon size={17} style={{ color: c.accent }} />
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
            style={{ color: c.footerText, opacity: 0.45, fontFamily: theme.fonts.body }}
          >
            © {new Date().getFullYear()} {clientData.businessName}. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: c.footerText, opacity: 0.35, fontFamily: theme.fonts.body }}
          >
            Built by Launchsite
          </p>
        </div>
      </div>
    </footer>
  );
}
