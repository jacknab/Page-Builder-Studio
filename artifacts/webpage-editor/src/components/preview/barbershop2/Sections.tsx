import { Theme } from "./themes";
import { ClientData } from "./types";
import { Phone, MapPin, Clock, Star, Instagram, Facebook, ExternalLink, Scissors } from "lucide-react";

interface Props { theme: Theme; clientData: ClientData; }

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
export function Navbar({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <nav style={{ background: c.navBg, borderBottom: `1px solid ${c.border}` }} className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div style={{ background: c.accent, color: c.accentText }} className="flex h-9 w-9 items-center justify-center rounded-lg">
            <Scissors className="h-5 w-5" />
          </div>
          <span style={{ color: c.navText, fontFamily: theme.fonts.heading }} className="text-xl font-bold tracking-wide uppercase">
            {clientData.businessName}
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {["Services", "About", "Reviews", "Contact"].map((item) => (
            <a key={item} href="#" style={{ color: c.navText, opacity: 0.75 }} className="text-sm font-medium transition hover:opacity-100">
              {item}
            </a>
          ))}
        </div>
        <a
          href={clientData.bookingUrl ?? "#"}
          style={{ background: c.accent, color: c.accentText }}
          className="rounded-lg px-5 py-2 text-sm font-bold transition hover:opacity-90"
        >
          Check In
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
export function Hero({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <section style={{ background: c.bg }} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Left — text */}
        <div className="flex flex-col justify-center px-6 py-20 lg:py-32">
          <div style={{ background: c.accent, color: c.accentText }} className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <span>Est. {clientData.established ?? "2010"}</span>
          </div>
          <h1 style={{ color: c.text, fontFamily: theme.fonts.heading }} className="text-5xl font-black leading-none tracking-tight md:text-6xl lg:text-7xl">
            {clientData.tagline}
          </h1>
          <p style={{ color: c.textMuted }} className="mt-6 max-w-md text-base leading-relaxed">
            {clientData.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={clientData.bookingUrl ?? "#"}
              style={{ background: c.accent, color: c.accentText }}
              className="rounded-xl px-8 py-3.5 font-bold transition hover:opacity-90"
            >
              Check In Now
            </a>
            {clientData.phone && (
              <a
                href={`tel:${clientData.phone}`}
                style={{ color: c.text, border: `2px solid ${c.border}` }}
                className="flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition hover:border-current"
              >
                <Phone className="h-4 w-4" />
                {clientData.phone}
              </a>
            )}
          </div>
        </div>
        {/* Right — image */}
        <div className="relative min-h-[400px] lg:min-h-0">
          <img
            src={theme.heroImage}
            alt={clientData.businessName}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div style={{ background: `linear-gradient(to right, ${c.bg}, transparent)` }} className="absolute inset-0 lg:block hidden" />
        </div>
      </div>
    </section>
  );
}

/* ─── Services ────────────────────────────────────────────────────────────── */
export function Services({ theme, clientData }: Props) {
  const c = theme.colors;
  const grouped: Record<string, typeof clientData.services> = {};
  for (const s of clientData.services) {
    const cat = s.category ?? "Services";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  }

  return (
    <section style={{ background: c.bgAlt }} className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p style={{ color: c.accent }} className="mb-2 text-sm font-bold uppercase tracking-widest">What we offer</p>
            <h2 style={{ color: c.text, fontFamily: theme.fonts.heading }} className="text-4xl font-black tracking-tight">
              Our Services
            </h2>
          </div>
          {clientData.bookingUrl && (
            <a href={clientData.bookingUrl} style={{ color: c.accent }} className="hidden items-center gap-1 text-sm font-bold hover:underline md:flex">
              Check in online <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {Object.entries(grouped).map(([cat, services]) => (
            <div key={cat}>
              <p style={{ color: c.textMuted, borderBottom: `1px solid ${c.border}` }} className="mb-4 pb-2 text-xs font-bold uppercase tracking-widest">
                {cat}
              </p>
              <div className="space-y-1">
                {services.map((s, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${c.border}` }} className="flex items-center justify-between py-3">
                    <div>
                      <p style={{ color: c.text }} className="font-semibold">{s.name}</p>
                      {s.duration && <p style={{ color: c.textMuted }} className="text-xs">{s.duration}</p>}
                    </div>
                    <span style={{ color: c.accent }} className="font-bold">{s.price}</span>
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

/* ─── About / Story ───────────────────────────────────────────────────────── */
export function About({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <section style={{ background: c.bg }} className="py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="https://images.pexels.com/photos/3998424/pexels-photo-3998424.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Inside the shop"
            className="h-full w-full object-cover"
            style={{ minHeight: "360px" }}
          />
          <div style={{ background: c.accent, color: c.accentText }} className="absolute bottom-6 left-6 rounded-xl px-5 py-4">
            <p style={{ fontFamily: theme.fonts.heading }} className="text-3xl font-black leading-none">
              {clientData.established ? new Date().getFullYear() - clientData.established : 10}+
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-80">Years in business</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p style={{ color: c.accent }} className="mb-3 text-sm font-bold uppercase tracking-widest">Our story</p>
          <h2 style={{ color: c.text, fontFamily: theme.fonts.heading }} className="text-4xl font-black tracking-tight">
            More than just a haircut
          </h2>
          <p style={{ color: c.textMuted }} className="mt-5 leading-relaxed">
            {clientData.description}
          </p>
          <p style={{ color: c.textMuted }} className="mt-4 leading-relaxed">
            We believe every client deserves a great experience — from the moment you walk in to the moment you leave looking your best.
          </p>
          {clientData.phone && (
            <a href={`tel:${clientData.phone}`} style={{ color: c.text, borderColor: c.border }} className="mt-8 flex w-fit items-center gap-3 rounded-xl border-2 px-6 py-3 font-semibold transition hover:border-current">
              <Phone className="h-4 w-4" />
              {clientData.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Reviews ─────────────────────────────────────────────────────────────── */
export function Reviews({ theme, clientData }: Props) {
  const c = theme.colors;
  const reviews = clientData.reviews ?? [
    { name: "James T.", text: "Best fade I've ever had. These guys know what they're doing.", rating: 5 },
    { name: "Marcus R.", text: "Walk in, walk out looking sharp. Every single time. My go-to shop.", rating: 5 },
    { name: "Derek W.", text: "Professional, fast, and the atmosphere is great. Highly recommend.", rating: 5 },
  ];

  return (
    <section style={{ background: c.bgAlt }} className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p style={{ color: c.accent }} className="mb-2 text-sm font-bold uppercase tracking-widest">What clients say</p>
          <h2 style={{ color: c.text, fontFamily: theme.fonts.heading }} className="text-4xl font-black tracking-tight">
            Reviews
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} style={{ background: c.card, border: `1px solid ${c.border}` }} className="rounded-2xl p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" style={{ color: c.accent }} />
                ))}
              </div>
              <p style={{ color: c.text }} className="mt-4 leading-relaxed">"{r.text}"</p>
              <p style={{ color: c.textMuted }} className="mt-4 text-sm font-bold">— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Booking CTA ─────────────────────────────────────────────────────────── */
export function BookingCTA({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <section style={{ background: c.accent }} className="py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 style={{ color: c.accentText, fontFamily: theme.fonts.heading }} className="text-4xl font-black tracking-tight md:text-5xl">
          Skip the wait. Check in online.
        </h2>
        <p style={{ color: c.accentText, opacity: 0.8 }} className="mt-4 text-lg">
          Join our queue from anywhere — we'll text you when it's your turn.
        </p>
        <a
          href={clientData.bookingUrl ?? "#"}
          style={{ background: c.bg, color: c.text }}
          className="mt-8 inline-block rounded-xl px-10 py-4 font-black transition hover:opacity-90"
        >
          Check In Now
        </a>
      </div>
    </section>
  );
}

/* ─── Contact / Hours ─────────────────────────────────────────────────────── */
export function Contact({ theme, clientData }: Props) {
  const c = theme.colors;
  const hoursEntries = [
    ["Monday", clientData.hours.monday],
    ["Tuesday", clientData.hours.tuesday],
    ["Wednesday", clientData.hours.wednesday],
    ["Thursday", clientData.hours.thursday],
    ["Friday", clientData.hours.friday],
    ["Saturday", clientData.hours.saturday],
    ["Sunday", clientData.hours.sunday],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <section style={{ background: c.bg }} className="py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2">
        {/* Hours */}
        <div>
          <p style={{ color: c.accent }} className="mb-3 text-sm font-bold uppercase tracking-widest">Hours</p>
          <h2 style={{ color: c.text, fontFamily: theme.fonts.heading }} className="mb-8 text-3xl font-black tracking-tight">
            When we're open
          </h2>
          <div className="space-y-2">
            {hoursEntries.map(([day, hours]) => (
              <div key={day} style={{ borderBottom: `1px solid ${c.border}` }} className="flex justify-between py-2.5">
                <span style={{ color: c.textMuted }} className="text-sm font-medium">{day}</span>
                <span style={{ color: c.text }} className="text-sm font-bold">{hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div>
          <p style={{ color: c.accent }} className="mb-3 text-sm font-bold uppercase tracking-widest">Contact</p>
          <h2 style={{ color: c.text, fontFamily: theme.fonts.heading }} className="mb-8 text-3xl font-black tracking-tight">
            Find us
          </h2>
          <div className="space-y-6">
            {clientData.address && (
              <div className="flex items-start gap-4">
                <div style={{ background: c.bgAlt, color: c.accent }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ color: c.textMuted }} className="text-xs font-bold uppercase tracking-widest">Address</p>
                  <p style={{ color: c.text }} className="mt-1 font-semibold">{clientData.address}</p>
                </div>
              </div>
            )}
            {clientData.phone && (
              <div className="flex items-start gap-4">
                <div style={{ background: c.bgAlt, color: c.accent }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ color: c.textMuted }} className="text-xs font-bold uppercase tracking-widest">Phone</p>
                  <a href={`tel:${clientData.phone}`} style={{ color: c.text }} className="mt-1 block font-semibold hover:underline">{clientData.phone}</a>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div style={{ background: c.bgAlt, color: c.accent }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p style={{ color: c.textMuted }} className="text-xs font-bold uppercase tracking-widest">Walk-ins</p>
                <p style={{ color: c.text }} className="mt-1 font-semibold">Welcome during business hours</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {clientData.instagramUrl && (
              <a href={clientData.instagramUrl} style={{ background: c.bgAlt, color: c.textMuted }} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-80">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {clientData.facebookUrl && (
              <a href={clientData.facebookUrl} style={{ background: c.bgAlt, color: c.textMuted }} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-80">
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */
export function Footer({ theme, clientData }: Props) {
  const c = theme.colors;
  return (
    <footer style={{ background: c.footerBg, borderTop: `1px solid ${c.border}` }} className="py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4" style={{ color: c.accent }} />
          <span style={{ color: c.footerText, fontFamily: theme.fonts.heading }} className="font-bold uppercase tracking-wide">
            {clientData.businessName}
          </span>
        </div>
        <p style={{ color: c.footerText }} className="text-xs">
          © {new Date().getFullYear()} {clientData.businessName}. All rights reserved.
        </p>
        {clientData.bookingUrl && (
          <a href={clientData.bookingUrl} style={{ color: c.accent }} className="text-xs font-bold hover:underline">
            Check in online →
          </a>
        )}
      </div>
    </footer>
  );
}
