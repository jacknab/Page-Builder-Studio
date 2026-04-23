import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout";

type Category = "barbershop" | "nail-salon" | "hair-salon" | "haircut-studio";

interface TemplateCard {
  id: string;
  name: string;
  description: string;
  category: Category;
  heroImage: string;
  accentColor: string;
  bgColor: string;
  style: string;
}

const PEXELS_BARBER = "https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=800";
const PEXELS_SALON = "https://images.pexels.com/photos/3993312/pexels-photo-3993312.jpeg?auto=compress&cs=tinysrgb&w=800";
const PEXELS_MIRROR = "https://images.pexels.com/photos/3993299/pexels-photo-3993299.jpeg?auto=compress&cs=tinysrgb&w=800";
const PEXELS_DARK = "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800";
const PEXELS_CHAIR = "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800";

const BARBERSHOP_TEMPLATES: TemplateCard[] = [
  { id: "midnight-gold",     name: "Midnight & Gold",      description: "Dark luxury with gold accents",                  category: "barbershop", heroImage: PEXELS_BARBER,  accentColor: "#d4a853", bgColor: "#0a0a0a",  style: "Luxury" },
  { id: "cream-heritage",    name: "Cream & Heritage",     description: "Warm cream tones with rich brown",               category: "barbershop", heroImage: PEXELS_SALON,   accentColor: "#8b4513", bgColor: "#faf6f0",  style: "Classic" },
  { id: "slate-steel",       name: "Slate & Steel",        description: "Cool grays with steel blue accents",             category: "barbershop", heroImage: PEXELS_DARK,    accentColor: "#38bdf8", bgColor: "#1e293b",  style: "Modern" },
  { id: "obsidian-copper",   name: "Obsidian & Copper",    description: "Deep black with warm copper highlights",         category: "barbershop", heroImage: PEXELS_CHAIR,   accentColor: "#c87533", bgColor: "#0c0c0c",  style: "Industrial" },
  { id: "ivory-emerald",     name: "Ivory & Emerald",      description: "Clean ivory with rich emerald green",            category: "barbershop", heroImage: PEXELS_MIRROR,  accentColor: "#2d6a4f", bgColor: "#fffff0",  style: "Classic" },
  { id: "charcoal-crimson",  name: "Charcoal & Crimson",   description: "Dark charcoal with bold red accents",            category: "barbershop", heroImage: PEXELS_BARBER,  accentColor: "#dc2626", bgColor: "#1a1a1a",  style: "Bold" },
  { id: "sand-turquoise",    name: "Sand & Turquoise",     description: "Desert sand with turquoise accents",             category: "barbershop", heroImage: PEXELS_CHAIR,   accentColor: "#2a9d8f", bgColor: "#f4efe6",  style: "Tropical" },
  { id: "noir-silver",       name: "Noir & Silver",        description: "Pure black with silver metallic",               category: "barbershop", heroImage: PEXELS_DARK,    accentColor: "#c0c0c0", bgColor: "#000000",  style: "Minimal" },
  { id: "walnut-brass",      name: "Walnut & Brass",       description: "Rich walnut wood with brass hardware",           category: "barbershop", heroImage: PEXELS_SALON,   accentColor: "#d4a843", bgColor: "#3e2723",  style: "Rustic" },
  { id: "frost-navy",        name: "Frost & Navy",         description: "Icy white with deep navy blue",                 category: "barbershop", heroImage: PEXELS_MIRROR,  accentColor: "#1e3a5f", bgColor: "#f8fafc",  style: "Scandinavian" },
  { id: "espresso-cream",    name: "Espresso & Cream",     description: "Rich espresso brown with cream",                 category: "barbershop", heroImage: PEXELS_BARBER,  accentColor: "#f5deb3", bgColor: "#2c1e14",  style: "Rustic" },
  { id: "graphite-amber",    name: "Graphite & Amber",     description: "Cool graphite with warm amber glow",             category: "barbershop", heroImage: PEXELS_DARK,    accentColor: "#f59e0b", bgColor: "#2d3436",  style: "Industrial" },
  { id: "pearl-rosewood",    name: "Pearl & Rosewood",     description: "Soft pearl white with rosewood accents",         category: "barbershop", heroImage: PEXELS_SALON,   accentColor: "#8b2252", bgColor: "#faf5f0",  style: "Art Deco" },
  { id: "onyx-teal",         name: "Onyx & Teal",          description: "Deep onyx with vibrant teal",                   category: "barbershop", heroImage: PEXELS_CHAIR,   accentColor: "#14b8a6", bgColor: "#121212",  style: "Contemporary" },
  { id: "linen-charcoal",    name: "Linen & Charcoal",     description: "Natural linen with charcoal accents",           category: "barbershop", heroImage: PEXELS_MIRROR,  accentColor: "#333333", bgColor: "#f5f0e8",  style: "Minimal" },
  { id: "volcanic-ember",    name: "Volcanic & Ember",     description: "Volcanic black with fiery orange embers",        category: "barbershop", heroImage: PEXELS_BARBER,  accentColor: "#ff6d00", bgColor: "#1a0a00",  style: "Bold" },
  { id: "arctic-fjord",      name: "Arctic & Fjord",       description: "Glacial white with deep Nordic blue",           category: "barbershop", heroImage: PEXELS_MIRROR,  accentColor: "#0c4a6e", bgColor: "#f0f4f8",  style: "Scandinavian" },
  { id: "mahogany-whiskey",  name: "Mahogany & Whiskey",   description: "Rich mahogany wood with whiskey amber",          category: "barbershop", heroImage: PEXELS_SALON,   accentColor: "#d4880f", bgColor: "#4a1c1c",  style: "Luxury" },
  { id: "concrete-moss",     name: "Concrete & Moss",      description: "Raw concrete gray with living moss green",       category: "barbershop", heroImage: PEXELS_CHAIR,   accentColor: "#4a7c59", bgColor: "#e8e4e0",  style: "Contemporary" },
  { id: "midnight-sapphire", name: "Midnight & Sapphire",  description: "Deep midnight blue with sapphire brilliance",   category: "barbershop", heroImage: PEXELS_DARK,    accentColor: "#3b82f6", bgColor: "#0a1628",  style: "Modern" },
  { id: "desert-sunset",     name: "Desert & Sunset",      description: "Warm desert sand with sunset coral",            category: "barbershop", heroImage: PEXELS_CHAIR,   accentColor: "#e07a5f", bgColor: "#fdf6ec",  style: "Tropical" },
  { id: "thunder-platinum",  name: "Thunder & Platinum",   description: "Storm gray with platinum metallic sheen",        category: "barbershop", heroImage: PEXELS_DARK,    accentColor: "#e5e4e2", bgColor: "#2d2d2d",  style: "Industrial" },
  { id: "sage-terracotta",   name: "Sage & Terracotta",    description: "Muted sage green with warm terracotta",         category: "barbershop", heroImage: PEXELS_SALON,   accentColor: "#c4724e", bgColor: "#f4f1eb",  style: "Rustic" },
  { id: "neon-carbon",       name: "Neon & Carbon",        description: "Carbon fiber black with electric neon green",   category: "barbershop", heroImage: PEXELS_BARBER,  accentColor: "#39ff14", bgColor: "#0a0a0a",  style: "Retro" },
  { id: "porcelain-ink",     name: "Porcelain & Ink",      description: "Delicate porcelain white with ink black",       category: "barbershop", heroImage: PEXELS_MIRROR,  accentColor: "#1a1a1a", bgColor: "#faf8f5",  style: "Art Deco" },
];

const NAIL_SALON_TEMPLATES: TemplateCard[] = [
  {
    id: "glamour-nails-franchise",
    name: "Glamour Nails",
    description: "Bold walk-in nail salon with booking, services, and franchise-style navigation.",
    category: "nail-salon",
    heroImage: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800",
    accentColor: "#d0021b",
    bgColor: "#ffffff",
    style: "Bold",
  },
  {
    id: "noir-nails-studio",
    name: "NOIR Nails Studio",
    description: "Dark editorial nail studio design with high-contrast gallery and premium booking.",
    category: "nail-salon",
    heroImage: "https://images.pexels.com/photos/3997383/pexels-photo-3997383.jpeg?auto=compress&cs=tinysrgb&w=800",
    accentColor: "#c8f542",
    bgColor: "#0a0a0a",
    style: "Dark",
  },
  {
    id: "lumiere-nails-luxury",
    name: "Lumière Nails",
    description: "Soft luxury nail studio with elegant typography, services, gallery, and booking.",
    category: "nail-salon",
    heroImage: "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=800",
    accentColor: "#C4A26B",
    bgColor: "#FAF6F1",
    style: "Luxury",
  },
];

const CATEGORIES: { id: Category; label: string; emoji: string; count: number | null }[] = [
  { id: "barbershop",      label: "Barbershop",      emoji: "💈", count: BARBERSHOP_TEMPLATES.length },
  { id: "nail-salon",      label: "Nail Salon",      emoji: "💅", count: NAIL_SALON_TEMPLATES.length },
  { id: "hair-salon",      label: "Hair Salon",      emoji: "✂️", count: null },
  { id: "haircut-studio",  label: "Haircut Studio",  emoji: "🪒", count: null },
];

const SIGNUP_URL = "https://164a3cac-ef64-450d-9bb9-d4905098b5ba-00-mr6ywxt9wxoc.kirk.replit.dev/signup";

const included = [
  "Mobile-ready layout",
  "Your services & prices",
  "Business hours",
  "Google listing link",
  "Social media links",
  "Contact section",
];

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<Category>("barbershop");

  const visibleTemplates =
    activeCategory === "barbershop"
      ? BARBERSHOP_TEMPLATES
      : activeCategory === "nail-salon"
      ? NAIL_SALON_TEMPLATES
      : [];

  const isComingSoon = activeCategory === "hair-salon" || activeCategory === "haircut-studio";

  return (
    <Layout currentPath="/templates">
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
            Step one: choose a template
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Professional templates for local service businesses.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Pick the design that fits your business. We'll fill it with your details — services,
            hours, links, and everything else — and launch it for you.
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const comingSoon = cat.count === null;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {cat.emoji} {cat.label}
                {comingSoon ? (
                  <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                    Soon
                  </span>
                ) : (
                  <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Template grid */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {isComingSoon ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 py-28 text-center">
            <p className="text-6xl">
              {CATEGORIES.find((c) => c.id === activeCategory)?.emoji}
            </p>
            <p className="mt-6 text-2xl font-black tracking-tight text-slate-300">Coming Soon</p>
            <p className="mt-2 text-sm text-slate-400">
              {CATEGORIES.find((c) => c.id === activeCategory)?.label} templates are being designed right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTemplates.map((tpl) => (
              <article
                key={tpl.id}
                className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={tpl.heroImage}
                    alt={tpl.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    style={{ filter: "brightness(0.8)" }}
                  />
                  <div
                    className="absolute inset-0 opacity-35"
                    style={{ background: `linear-gradient(135deg, ${tpl.bgColor} 0%, transparent 60%)` }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ background: tpl.accentColor }}
                  />
                  <span
                    className="absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow"
                    style={{ background: tpl.accentColor, color: tpl.bgColor === "#0a0a0a" || tpl.bgColor === "#000000" || tpl.bgColor === "#121212" || tpl.bgColor === "#0c0c0c" || tpl.bgColor === "#1a1a1a" || tpl.bgColor === "#2d2d2d" || tpl.bgColor === "#1e293b" || tpl.bgColor === "#0a1628" || tpl.bgColor === "#1a0a00" || tpl.bgColor === "#3e2723" || tpl.bgColor === "#4a1c1c" || tpl.bgColor === "#2c1e14" || tpl.bgColor === "#2d3436" ? "#ffffff" : tpl.bgColor }}
                  >
                    {tpl.style}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="font-extrabold tracking-tight leading-tight">{tpl.name}</p>
                  </div>
                  <p className="mb-4 text-xs leading-relaxed text-slate-500">{tpl.description}</p>
                  <a
                    href={SIGNUP_URL}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold text-white transition hover:opacity-90"
                    style={{ background: tpl.accentColor }}
                  >
                    Use this template
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
                Every template includes
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Everything your customers need to find, trust, and book you.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                We fill every template section with your real business information. No placeholder text left behind.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-center text-white md:p-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
            Found one you like?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Create an account, answer a few questions about your business, and we'll build the site around your chosen template.
          </p>
          <a
            href={SIGNUP_URL}
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-blue-700 transition hover:bg-blue-50"
          >
            Start my launch
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </Layout>
  );
}
