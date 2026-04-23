import { useEffect, useState } from "react";
import { getThemeById } from "./barbershop/themes";
import type { ClientData } from "./barbershop/types";
import {
  AnnouncementBar,
  Hero,
  StatsBar,
  WhyChoose,
  Services,
  Gallery,
  Barbers,
  Location,
  Footer,
} from "./barbershop/Sections";
import {
  Scissors,
  Phone,
  X,
  Check,
  Clock,
  Users,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

/* ─── Demo Data ──────────────────────────────────────────────────────────── */
const DEMO: ClientData = {
  themeId: "midnight-gold",
  businessName: "The Gentleman's Quarter",
  tagline: "Where Every Cut Tells a Story",
  description:
    "Denver's premier grooming destination. Walk in, sit back, and leave sharper than you arrived. Expert fades, classic cuts, and hot towel shaves — delivered with precision by our master barbers.",
  phone: "(720) 555-0174",
  email: "hello@gentlemansquarter.com",
  address: "512 Larimer Street, Denver, CO 80202",
  established: 2018,
  numberOfBarbers: 5,
  bookingUrl: "#",
  services: [
    { name: "The Gentleman's Cut", price: "$42", description: "Signature haircut — clippers on sides, scissor top, hot lather neck shave.", popular: true },
    { name: "Cut & Beard Combo", price: "$60", description: "Full haircut plus beard trim. Our most popular pairing.", popular: true },
    { name: "Zero Fade", price: "$44", description: "Crisp zero fade with scissor or clipper top finish.", popular: true },
    { name: "Hot Towel Shave", price: "$45", description: "Traditional straight razor shave with hot towel treatment." },
    { name: "Kids Haircut", price: "$28", description: "Patient, friendly cuts for the little ones." },
    { name: "Beard Trim & Shape", price: "$24", description: "Clean shape and trim to keep your beard sharp." },
    { name: "Line Up / Edge Up", price: "$18", description: "Clean edge-up around hairline, temples, and neckline." },
  ],
  barbers: [
    { name: "Victor", role: "Owner & Master Barber", yearsExp: 18, bio: "18 years of precision. My craft is in the details — every fade, every line, every time." },
    { name: "Dante", role: "Senior Barber", yearsExp: 12, bio: "Creative cuts and tight fades. No two clients leave looking the same." },
    { name: "Felix", role: "Barber", yearsExp: 8, bio: "Fast, clean, consistent. Trained in Chicago, cutting in Denver." },
    { name: "Marcus", role: "Barber & Grooming Specialist", yearsExp: 14, bio: "Textured hair expert. Beard sculpting is my superpower." },
    { name: "Leo", role: "Barber", yearsExp: 6, bio: "The newest face at the Quarter — fresh techniques, timeless results." },
  ],
  galleryImages: [
    "https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3993312/pexels-photo-3993312.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3993299/pexels-photo-3993299.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3998429/pexels-photo-3998429.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  hours: {
    monday: "9:00 AM – 7:00 PM",
    tuesday: "9:00 AM – 7:00 PM",
    wednesday: "9:00 AM – 7:00 PM",
    thursday: "9:00 AM – 7:00 PM",
    friday: "9:00 AM – 6:00 PM",
    saturday: "8:00 AM – 6:00 PM",
    sunday: "10:00 AM – 4:00 PM",
  },
  googleUrl: "#",
  instagramUrl: "#",
  facebookUrl: "#",
};

/* ─── Check-In Modal ─────────────────────────────────────────────────────── */
type CheckInStep = "form" | "confirmed";

function CheckInModal({
  accentColor,
  badgeText,
  onClose,
}: {
  accentColor: string;
  badgeText: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<CheckInStep>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmed");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl" style={{ background: "#1a1510", border: "1px solid rgba(212,168,83,0.2)" }}>

        {step === "form" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "rgba(212,168,83,0.15)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: accentColor }}>
                  <Scissors className="h-4 w-4" style={{ color: badgeText }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>Online Check-In</p>
                  <p className="text-sm font-bold text-white">The Gentleman's Quarter</p>
                </div>
              </div>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status bar */}
            <div className="flex divide-x p-0" style={{ borderBottom: "1px solid rgba(212,168,83,0.1)", divideColor: "rgba(212,168,83,0.1)" }}>
              <div className="flex flex-1 flex-col items-center gap-1 py-4">
                <div className="flex items-center gap-1.5" style={{ color: accentColor }}>
                  <Users className="h-4 w-4" />
                  <span className="text-lg font-black">3</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">In Queue</p>
              </div>
              <div className="flex flex-1 flex-col items-center gap-1 py-4" style={{ borderColor: "rgba(212,168,83,0.1)" }}>
                <div className="flex items-center gap-1.5" style={{ color: accentColor }}>
                  <Clock className="h-4 w-4" />
                  <span className="text-lg font-black">~25</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Min Wait</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/40">Your Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-white/20 focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,83,0.2)", focusRingColor: accentColor }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/40">Mobile Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(720) 555-0000"
                  type="tel"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-white/20 focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,83,0.2)" }}
                />
              </div>
              <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)" }}>
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(212,168,83,0.7)" }}>
                  We'll text you when it's almost your turn — ~15 min before.
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl py-3.5 text-sm font-black uppercase tracking-wide transition hover:opacity-90 active:scale-95"
                style={{ background: accentColor, color: badgeText }}
              >
                Check In Now
              </button>
            </form>
          </>
        )}

        {step === "confirmed" && (
          <div className="p-8 text-center">
            {/* Success icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: accentColor }}>
              <Check className="h-8 w-8" style={{ color: badgeText }} />
            </div>
            <h2 className="text-2xl font-black text-white">You're Checked In!</h2>
            <p className="mt-2 text-sm text-white/50">We'll text you when it's almost your turn.</p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,83,0.1)" }}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Position in Queue</p>
                <p className="mt-1 text-3xl font-black" style={{ color: accentColor }}>#1</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,83,0.1)" }}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Estimated Wait</p>
                <p className="mt-1 text-3xl font-black" style={{ color: accentColor }}>25 min</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)", height: "6px" }}>
              <div className="h-full w-3/4 rounded-full" style={{ background: accentColor }} />
            </div>
            <p className="mt-2 text-[11px] text-white/30">
              <AlertCircle className="mr-1 inline h-3 w-3" />
              We'll notify you ~15 minutes before your turn
            </p>

            <button
              onClick={() => setStep("form")}
              className="mt-6 w-full rounded-xl py-3 text-sm font-bold text-white/60 transition hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Check In Another Person
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Check-In Navbar (wraps the standard nav with Check In button) ───────── */
function CheckInNavbar({ themeAccent, badgeText, onCheckIn, businessName, fonts }: {
  themeAccent: string;
  badgeText: string;
  onCheckIn: () => void;
  businessName: string;
  fonts: { heading: string; body: string };
}) {
  return (
    <nav className="sticky top-0 left-0 right-0 z-40" style={{ backgroundColor: "#0d0d0d", borderBottom: "1px solid rgba(212,168,83,0.15)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full shrink-0" style={{ backgroundColor: themeAccent }}>
            <Scissors className="h-4 w-4" style={{ color: badgeText }} />
          </div>
          <div>
            <p className="text-sm font-black tracking-widest uppercase leading-none" style={{ color: "#fff", fontFamily: fonts.heading }}>
              {businessName}
            </p>
            <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: fonts.body }}>
              Barbershop
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-7">
          {["Services", "About", "Hours", "Contact"].map((label) => (
            <a key={label} href="#" className="text-sm font-medium transition-opacity hover:opacity-100" style={{ color: "#fff", opacity: 0.6, fontFamily: fonts.body }}>
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCheckIn}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: fonts.body }}
          >
            Check Status
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onCheckIn}
            className="px-5 py-2 rounded-lg font-black text-sm tracking-wide uppercase transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: themeAccent, color: badgeText, fontFamily: fonts.heading }}
          >
            Check In
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Check-In Promo Section ─────────────────────────────────────────────── */
function CheckInPromo({ themeAccent, badgeText, bg, card, border, text, textSecondary, onCheckIn, fonts }: {
  themeAccent: string; badgeText: string; bg: string; card: string; border: string;
  text: string; textSecondary: string; onCheckIn: () => void; fonts: { heading: string; body: string };
}) {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: card, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: themeAccent }}>
          <Clock className="h-7 w-7" style={{ color: badgeText }} />
        </div>
        <h2 className="text-3xl font-black md:text-4xl" style={{ color: text, fontFamily: fonts.heading }}>
          Skip the Wait. Check In Online.
        </h2>
        <p className="mt-4 text-base" style={{ color: textSecondary, fontFamily: fonts.body, opacity: 0.7 }}>
          Join the queue from anywhere — we'll text you when your barber is ready.
          No appointment needed, no standing around.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={onCheckIn}
            className="flex items-center gap-2 rounded-xl px-8 py-4 font-black text-sm uppercase tracking-wide transition hover:scale-105 active:scale-95"
            style={{ background: themeAccent, color: badgeText, fontFamily: fonts.heading }}
          >
            <Users className="h-4 w-4" />
            Check In Now
          </button>
          <div className="flex items-center gap-2 text-sm" style={{ color: textSecondary, opacity: 0.6 }}>
            <Clock className="h-4 w-4" />
            <span>~3 people in queue · ~25 min wait</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Preview Component ─────────────────────────────────────────────── */
export default function BarbershopPreview3({ themeId }: { themeId: string }) {
  const theme = getThemeById(themeId);
  const c = theme.colors;
  const [checkInOpen, setCheckInOpen] = useState(false);

  useEffect(() => {
    const families = [
      theme.fonts.heading.split(",")[0].trim().replace(/'/g, ""),
      theme.fonts.body.split(",")[0].trim().replace(/'/g, ""),
    ];
    [...new Set(families)].forEach((font) => {
      const id = `gfont-prev-bs3-${font.replace(/ /g, "-")}`;
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
        .bs3-preview h1,.bs3-preview h2,.bs3-preview h3,.bs3-preview h4,.bs3-preview h5,.bs3-preview h6 {
          font-family: ${theme.fonts.heading};
        }
      `}</style>
      <div className="bs3-preview">
        <AnnouncementBar theme={theme} clientData={DEMO} />
        <CheckInNavbar
          themeAccent={c.accent}
          badgeText={(c as any).badgeText ?? "#000"}
          onCheckIn={() => setCheckInOpen(true)}
          businessName={DEMO.businessName}
          fonts={theme.fonts}
        />
        <Hero theme={theme} clientData={DEMO} />
        <StatsBar theme={theme} clientData={DEMO} />
        <CheckInPromo
          themeAccent={c.accent}
          badgeText={(c as any).badgeText ?? "#000"}
          bg={c.bg}
          card={(c as any).card ?? c.bg}
          border={(c as any).border ?? "rgba(255,255,255,0.1)"}
          text={c.text}
          textSecondary={(c as any).textSecondary ?? c.text}
          onCheckIn={() => setCheckInOpen(true)}
          fonts={theme.fonts}
        />
        <WhyChoose theme={theme} clientData={DEMO} />
        <Services theme={theme} clientData={DEMO} />
        <Gallery theme={theme} clientData={DEMO} />
        <Barbers theme={theme} clientData={DEMO} />
        <Location theme={theme} clientData={DEMO} />
        <Footer theme={theme} clientData={DEMO} />
      </div>

      {checkInOpen && (
        <CheckInModal
          accentColor={c.accent}
          badgeText={(c as any).badgeText ?? "#000"}
          onClose={() => setCheckInOpen(false)}
        />
      )}
    </div>
  );
}
