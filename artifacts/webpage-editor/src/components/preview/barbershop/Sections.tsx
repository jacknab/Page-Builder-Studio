import { Theme } from "./themes";
import { ClientData } from "./types";
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
  Check,
  Users,
  CalendarCheck,
} from "lucide-react";

interface Props {
  theme: Theme;
  clientData: ClientData;
}

// ─── ANNOUNCEMENT BAR ───────────────────────────────────────────────────────

export function AnnouncementBar({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <div
      className="w-full text-center px-4 py-2 text-sm font-semibold"
      style={{ backgroundColor: c.accent, color: c.badgeText }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-1 flex-wrap">
        <span>Walk-ins Welcome · Online Check-In Available</span>
        {clientData.address && (
          <>
            <span className="hidden sm:inline opacity-50">·</span>
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin size={13} />
              {clientData.address}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── NAVBAR ─────────────────────────────────────────────────────────────────

export function Navbar({ theme, clientData }: Props) {
  const c = theme.colors;
  const bookingUrl = clientData.bookingUrl || "#location";
  return (
    <nav
      className="sticky top-0 left-0 right-0 z-40"
      style={{ backgroundColor: c.navBg, borderBottom: `1px solid ${c.border}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full shrink-0"
              style={{ backgroundColor: c.accent }}
            >
              <Scissors size={17} style={{ color: c.badgeText }} />
            </div>
            <div>
              <p
                className="text-sm font-black tracking-widest uppercase leading-none"
                style={{ color: c.navText, fontFamily: theme.fonts.heading }}
              >
                {clientData.businessName}
              </p>
              <p
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.6 }}
              >
                Barbershop
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {[
              ["#services", "Services"],
              ["#about", "About"],
              ["#barbers", "Our Barbers"],
              ["#gallery", "Gallery"],
              ["#location", "Location"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium transition-opacity hover:opacity-100"
                style={{ color: c.navText, fontFamily: theme.fonts.body, opacity: 0.7 }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right: phone + CTA */}
          <div className="flex items-center gap-3">
            {clientData.phone && (
              <a
                href={`tel:${clientData.phone}`}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                <Phone size={14} style={{ color: c.accent }} />
                {clientData.phone}
              </a>
            )}
            <a
              href={bookingUrl}
              className="px-5 py-2 rounded-lg font-black text-sm tracking-wide uppercase transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: c.buttonPrimary,
                color: c.badgeText,
                fontFamily: theme.fonts.heading,
              }}
            >
              Check In
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

export function Hero({ theme, clientData }: Props) {
  const c = theme.colors;
  const bookingUrl = clientData.bookingUrl || "#services";

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${theme.heroImage})` }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: c.heroOverlay }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              border: `1px solid rgba(255,255,255,0.2)`,
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span
              className="text-sm font-medium"
              style={{ color: "#fff", fontFamily: theme.fonts.body }}
            >
              Walk-ins Welcome
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-3"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            {clientData.businessName}
          </h1>
          <p
            className="text-2xl sm:text-3xl font-bold mb-6 leading-snug"
            style={{ color: c.accent, fontFamily: theme.fonts.heading }}
          >
            {clientData.tagline}
          </p>

          {/* Description */}
          <p
            className="text-base md:text-lg mb-8 max-w-xl leading-relaxed"
            style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.9 }}
          >
            {clientData.description?.slice(0, 160)}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
            {[
              "Walk-ins Welcome",
              "Expert Barbers",
              clientData.established ? `Est. ${clientData.established}` : "Easy Booking",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                <Check size={15} style={{ color: c.accent }} />
                {item}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={bookingUrl}
              className="px-8 py-4 rounded-xl font-black text-base uppercase tracking-wide text-center transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: c.buttonPrimary,
                color: c.badgeText,
                fontFamily: theme.fonts.heading,
              }}
            >
              Check In Now
            </a>
            {clientData.phone && (
              <a
                href={`tel:${clientData.phone}`}
                className="px-8 py-4 rounded-xl font-black text-base uppercase tracking-wide text-center transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  border: `2px solid ${c.accent}`,
                  color: c.accent,
                  fontFamily: theme.fonts.heading,
                  backgroundColor: "transparent",
                }}
              >
                <Phone size={16} />
                Call Now
              </a>
            )}
          </div>
          <p
            className="mt-4 text-xs"
            style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.55 }}
          >
            ⚡ Join the queue online – skip the wait
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────

export function StatsBar({ theme, clientData }: Props) {
  const c = theme.colors;
  const currentYear = new Date().getFullYear();
  const yearsOpen = clientData.established ? currentYear - clientData.established : null;

  const stats = [
    { value: "1000+", label: "5-Star Reviews" },
    yearsOpen !== null ? { value: `${yearsOpen}+`, label: "Years Experience" } : null,
    clientData.numberOfBarbers
      ? { value: String(clientData.numberOfBarbers), label: "Expert Barbers" }
      : null,
    clientData.established ? { value: String(clientData.established), label: "Est." } : null,
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <div
      className="py-10 px-4"
      style={{ backgroundColor: c.bgSecondary, borderBottom: `1px solid ${c.border}` }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid gap-0 ${
            stats.length <= 2
              ? "grid-cols-2"
              : stats.length === 3
              ? "grid-cols-3"
              : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center py-4"
              style={{
                borderLeft: i > 0 ? `1px solid ${c.border}` : "none",
              }}
            >
              <p
                className="text-3xl md:text-4xl font-black mb-1"
                style={{ color: c.accent, fontFamily: theme.fonts.heading }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WHY CHOOSE ──────────────────────────────────────────────────────────────

export function WhyChoose({ theme, clientData }: Props) {
  const c = theme.colors;
  const features = [
    {
      Icon: Scissors,
      title: "Expert Barbers",
      desc: "Skilled professionals dedicated to delivering the perfect cut every visit — from clean fades to classic cuts.",
    },
    {
      Icon: Star,
      title: "5-Star Rated",
      desc: "Hundreds of satisfied clients trust us in our community. Real results, real reviews, real satisfaction.",
    },
    {
      Icon: CalendarCheck,
      title: "In & Out, Looking Sharp",
      desc: "Join our online queue from anywhere. We'll text you when it's almost your turn — no long waits.",
    },
  ];

  return (
    <section id="about" className="py-20 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Why Choose {clientData.businessName}
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
          >
            More than a haircut. An experience built on skill, attention, and respect for the craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="p-8 rounded-2xl text-center"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: c.accentLight, border: `1px solid ${c.accent}` }}
              >
                <Icon size={22} style={{ color: c.accent }} />
              </div>
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: c.text, fontFamily: theme.fonts.heading }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.8 }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {clientData.description && (
          <div
            className="p-8 rounded-2xl text-center max-w-3xl mx-auto"
            style={{ backgroundColor: c.bgSecondary, border: `1px solid ${c.border}` }}
          >
            <p
              className="text-base leading-relaxed"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
            >
              {clientData.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

export function Services({ theme, clientData }: Props) {
  const c = theme.colors;
  const bookingUrl = clientData.bookingUrl || "#location";
  const displayed = clientData.services.slice(0, 6);

  return (
    <section id="services" className="py-20 px-4" style={{ backgroundColor: c.bgSecondary }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              Popular Services
            </h2>
            <p
              className="text-sm"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
            >
              Our most requested cuts and grooming services.
            </p>
          </div>
          <a
            href={bookingUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all hover:scale-105 whitespace-nowrap"
            style={{
              border: `1.5px solid ${c.accent}`,
              color: c.accent,
              fontFamily: theme.fonts.heading,
            }}
          >
            View All Prices
            <ChevronRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((service, i) => {
            const isPopular = service.popular || i < 3;
            return (
              <div
                key={service.name}
                className="p-6 rounded-2xl flex flex-col"
                style={{
                  backgroundColor: c.card,
                  border: `1px solid ${c.border}`,
                }}
              >
                {isPopular && (
                  <div className="mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold"
                      style={{ backgroundColor: c.accentLight, color: c.accent }}
                    >
                      <Star size={11} fill={c.accent} style={{ color: c.accent }} />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3
                    className="text-lg font-bold leading-snug"
                    style={{ color: c.text, fontFamily: theme.fonts.heading }}
                  >
                    {service.name}
                  </h3>
                  {service.price && (
                    <span
                      className="text-xl font-black shrink-0"
                      style={{ color: c.accent, fontFamily: theme.fonts.heading }}
                    >
                      {service.price}
                    </span>
                  )}
                </div>

                {service.description && (
                  <p
                    className="text-sm leading-relaxed mb-4 flex-1"
                    style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.8 }}
                  >
                    {service.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-end pt-2">
                  <a
                    href={bookingUrl}
                    className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all hover:scale-105"
                    style={{
                      border: `1.5px solid ${c.accent}`,
                      color: c.accent,
                      fontFamily: theme.fonts.heading,
                    }}
                  >
                    Check In
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

const GALLERY_FALLBACK = [
  "https://images.pexels.com/photos/3998430/pexels-photo-3998430.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1319462/pexels-photo-1319462.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4947353/pexels-photo-4947353.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3998391/pexels-photo-3998391.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export function Gallery({ theme, clientData }: Props) {
  const c = theme.colors;
  const images = clientData.galleryImages?.length ? clientData.galleryImages : GALLERY_FALLBACK;
  const displayed = images.slice(0, 4);

  return (
    <section id="gallery" className="py-20 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              Our Work
            </h2>
            <p
              className="text-sm"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
            >
              See the craft and transformations we deliver every day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayed.map((src, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
              style={{ border: `1px solid ${c.border}` }}
            >
              <img
                src={src}
                alt={`Barbershop work ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ aspectRatio: i === 0 ? "1 / 1" : "1 / 1", display: "block" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BARBERS ─────────────────────────────────────────────────────────────────

export function Barbers({ theme, clientData }: Props) {
  const c = theme.colors;
  const barbers = clientData.barbers;
  if (!barbers || barbers.length === 0) return null;
  const bookingUrl = clientData.bookingUrl || "#location";

  const gridClass =
    barbers.length === 1
      ? "max-w-sm mx-auto"
      : barbers.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
      : barbers.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="barbers" className="py-20 px-4" style={{ backgroundColor: c.bgSecondary }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Meet Your Barbers
          </h2>
          <p
            className="text-base max-w-md mx-auto"
            style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
          >
            Expert barbers dedicated to finding your perfect style.
          </p>
        </div>

        <div className={`grid gap-6 ${gridClass}`}>
          {barbers.map((barber) => (
            <div
              key={barber.name}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
            >
              {/* Photo */}
              <div className="relative overflow-hidden" style={{ paddingBottom: "100%" }}>
                {barber.photoUrl ? (
                  <img
                    src={barber.photoUrl}
                    alt={barber.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: c.bgSecondary }}
                  >
                    <Users size={48} style={{ color: c.border }} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {barber.yearsExp && (
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: c.accent, color: c.badgeText }}
                    >
                      {barber.yearsExp}+ yrs
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="text-xl font-bold mb-0.5"
                  style={{ color: c.text, fontFamily: theme.fonts.heading }}
                >
                  {barber.name}
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
                >
                  {barber.role}
                </p>
                {barber.bio && (
                  <p
                    className="text-sm mb-4 leading-relaxed flex-1"
                    style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.6 }}
                  >
                    {barber.bio}
                  </p>
                )}
                <a
                  href={barber.bookingUrl || bookingUrl}
                  className="mt-auto block w-full text-center py-2.5 rounded-xl text-sm font-black uppercase tracking-wide transition-all hover:scale-105"
                  style={{
                    backgroundColor: c.buttonPrimary,
                    color: c.badgeText,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  Check In
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LOCATION ────────────────────────────────────────────────────────────────

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function Location({ theme, clientData }: Props) {
  const c = theme.colors;
  const days = Object.entries(clientData.hours) as [string, string | undefined][];
  const mapEmbedUrl = clientData.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(clientData.address)}&output=embed&z=15`
    : null;
  const directionsUrl =
    clientData.googleUrl ||
    (clientData.address
      ? `https://maps.google.com/?q=${encodeURIComponent(clientData.address)}`
      : "#");

  return (
    <section id="location" className="py-20 px-4" style={{ backgroundColor: c.bg }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: info */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              Find Us
            </h2>
            <p
              className="text-base mb-10 max-w-sm"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.7 }}
            >
              Come visit us. We're always ready to give you a great experience.
            </p>

            <div className="space-y-6 mb-10">
              {clientData.address && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: c.accentLight, border: `1px solid ${c.accent}` }}
                  >
                    <MapPin size={18} style={{ color: c.accent }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: c.accent, fontFamily: theme.fonts.body }}
                    >
                      Address
                    </p>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: c.text, fontFamily: theme.fonts.body }}
                    >
                      {clientData.address}
                    </p>
                  </div>
                </div>
              )}

              {clientData.phone && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: c.accentLight, border: `1px solid ${c.accent}` }}
                  >
                    <Phone size={18} style={{ color: c.accent }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: c.accent, fontFamily: theme.fonts.body }}
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${clientData.phone}`}
                      className="font-semibold text-sm hover:opacity-80 transition-opacity"
                      style={{ color: c.text, fontFamily: theme.fonts.body }}
                    >
                      {clientData.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: c.accentLight, border: `1px solid ${c.accent}` }}
                >
                  <Clock size={18} style={{ color: c.accent }} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: c.accent, fontFamily: theme.fonts.body }}
                  >
                    Hours
                  </p>
                  <div className="space-y-1.5">
                    {days.map(([day, time]) => (
                      <div key={day} className="flex gap-4 text-sm">
                        <span
                          className="w-8 font-semibold"
                          style={{
                            color: c.textSecondary,
                            fontFamily: theme.fonts.body,
                            opacity: 0.7,
                          }}
                        >
                          {DAY_LABELS[day] ?? day}
                        </span>
                        <span
                          style={{
                            color:
                              time?.toLowerCase() === "closed" ? c.textSecondary : c.text,
                            fontFamily: theme.fonts.body,
                            opacity: time?.toLowerCase() === "closed" ? 0.45 : 1,
                          }}
                        >
                          {time ?? "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all hover:scale-105"
              style={{
                border: `1.5px solid ${c.accent}`,
                color: c.accent,
                fontFamily: theme.fonts.heading,
              }}
            >
              Get Directions
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Right: map */}
          {mapEmbedUrl ? (
            <div
              className="overflow-hidden rounded-2xl"
              style={{ height: "500px", border: `1px solid ${c.border}` }}
            >
              <iframe
                title={`${clientData.businessName} location map`}
                src={mapEmbedUrl}
                className="w-full h-full"
                style={{ border: "none" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                height: "500px",
                backgroundColor: c.card,
                border: `1px solid ${c.border}`,
              }}
            >
              <div className="text-center">
                <MapPin size={40} className="mx-auto mb-3" style={{ color: c.border }} />
                <p
                  className="text-sm"
                  style={{ color: c.textSecondary, fontFamily: theme.fonts.body, opacity: 0.5 }}
                >
                  Map loads once address is set
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

export function Footer({ theme, clientData }: Props) {
  const c = theme.colors;
  const days = Object.entries(clientData.hours) as [string, string | undefined][];

  type SocialLink = {
    Icon: React.ElementType;
    href: string;
    label: string;
  };

  const socials: SocialLink[] = (
    [
      clientData.instagramUrl && { Icon: Instagram, href: clientData.instagramUrl, label: "Instagram" },
      clientData.facebookUrl && { Icon: Facebook, href: clientData.facebookUrl, label: "Facebook" },
      clientData.yelpUrl && { Icon: ExternalLink, href: clientData.yelpUrl, label: "Yelp" },
    ] as (SocialLink | false)[]
  ).filter(Boolean) as SocialLink[];

  return (
    <footer className="pt-16 pb-8 px-4" style={{ backgroundColor: c.footerBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full shrink-0"
                style={{ backgroundColor: c.accent }}
              >
                <Scissors size={17} style={{ color: c.badgeText }} />
              </div>
              <div>
                <p
                  className="text-sm font-black tracking-widest uppercase leading-none"
                  style={{ color: c.footerText, fontFamily: theme.fonts.heading }}
                >
                  {clientData.businessName}
                </p>
                <p
                  className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.5 }}
                >
                  Barbershop
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.55 }}
            >
              {clientData.tagline}
              {clientData.established ? `. Est. ${clientData.established}.` : ""}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
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
                    <Icon size={16} style={{ color: c.accent }} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <p
              className="text-sm font-black uppercase tracking-wider mb-5"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {[
                ["#", "Home"],
                ["#services", "Services"],
                ["#about", "About"],
                ["#barbers", "Our Barbers"],
                ["#gallery", "Gallery"],
                ["#location", "Location"],
              ].map(([href, label]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm transition-opacity hover:opacity-100"
                    style={{
                      color: c.footerText,
                      fontFamily: theme.fonts.body,
                      opacity: 0.55,
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-sm font-black uppercase tracking-wider mb-5"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              Contact
            </p>
            <ul className="space-y-3">
              {clientData.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: c.accent }} />
                  <span
                    className="text-sm"
                    style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.55 }}
                  >
                    {clientData.address}
                  </span>
                </li>
              )}
              {clientData.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="shrink-0" style={{ color: c.accent }} />
                  <a
                    href={`tel:${clientData.phone}`}
                    className="text-sm transition-opacity hover:opacity-100"
                    style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.55 }}
                  >
                    {clientData.phone}
                  </a>
                </li>
              )}
              {clientData.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="shrink-0" style={{ color: c.accent }} />
                  <a
                    href={`mailto:${clientData.email}`}
                    className="text-sm transition-opacity hover:opacity-100"
                    style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.55 }}
                  >
                    {clientData.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p
              className="text-sm font-black uppercase tracking-wider mb-5"
              style={{ color: c.text, fontFamily: theme.fonts.heading }}
            >
              Hours
            </p>
            <ul className="space-y-2">
              {days.map(([day, time]) => (
                <li key={day} className="flex justify-between gap-3 text-sm">
                  <span
                    style={{
                      color: c.footerText,
                      fontFamily: theme.fonts.body,
                      opacity: 0.5,
                    }}
                  >
                    {DAY_LABELS[day] ?? day}
                  </span>
                  <span
                    style={{
                      color:
                        time?.toLowerCase() === "closed" ? c.textSecondary : c.footerText,
                      fontFamily: theme.fonts.body,
                      opacity: time?.toLowerCase() === "closed" ? 0.4 : 0.75,
                    }}
                  >
                    {time ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2"
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <p
            className="text-xs"
            style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.35 }}
          >
            © {new Date().getFullYear()} {clientData.businessName}. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: c.footerText, fontFamily: theme.fonts.body, opacity: 0.25 }}
          >
            Built by Launchsite
          </p>
        </div>
      </div>
    </footer>
  );
}

// Legacy exports kept for compatibility
export { Award };
