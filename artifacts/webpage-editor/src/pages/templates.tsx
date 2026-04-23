import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import {
  BARBERSHOP_THEMES,
  NAIL_SALON_THEMES,
  type LaunchsiteTemplate,
} from "@/lib/launchsiteTemplates";
import TemplatePreview from "@/components/preview/TemplatePreview";

type FilterId = "all" | "barbershop" | "nail-salon" | "hair-salon" | "haircut-studio";

interface Category {
  id: FilterId;
  label: string;
  emoji: string;
  themes: LaunchsiteTemplate[];
  available: boolean;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: "hair-salon",
    label: "Hair Salon",
    emoji: "✂️",
    themes: [],
    available: false,
    description: "Elegant sites for hair stylists and salons",
  },
  {
    id: "nail-salon",
    label: "Nail Salon",
    emoji: "💅",
    themes: NAIL_SALON_THEMES,
    available: true,
    description: "Polished, beautiful sites for nail studios",
  },
  {
    id: "barbershop",
    label: "Barbershop",
    emoji: "💈",
    themes: BARBERSHOP_THEMES,
    available: true,
    description: "Bold, sharp sites for barbershops",
  },
  {
    id: "haircut-studio",
    label: "Haircut Studio",
    emoji: "🪒",
    themes: [],
    available: false,
    description: "Modern sites for haircut studios",
  },
];

/* ─── Preview Modal ─────────────────────────────────────────────────────── */
function PreviewModal({
  category,
  onClose,
  onGetStarted,
}: {
  category: Category;
  onClose: () => void;
  onGetStarted: () => void;
}) {
  const [activeThemeId, setActiveThemeId] = useState(category.themes[0]?.id ?? "");
  const activeTheme = category.themes.find((t) => t.id === activeThemeId) ?? category.themes[0];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!activeTheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 border-b"
        style={{ background: "#111", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="flex h-12 items-center gap-3 px-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">{category.emoji}</span>
            <span className="text-sm font-bold text-white">{category.label}</span>
            <span className="text-sm text-white/40">—</span>
            <span className="text-sm font-semibold text-white/80">{activeTheme.name}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: activeTheme.accentColor, color: "#fff" }}
            >
              {activeTheme.style}
            </span>
          </div>
          <div className="flex-1" />
          <Button
            size="sm"
            onClick={onGetStarted}
            className="h-8 gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-bold hover:bg-blue-500"
          >
            Get Started
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Style pills */}
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {category.themes.map((t) => {
            const active = t.id === activeThemeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveThemeId(t.id)}
                className="rounded-full px-3 py-1 text-xs font-semibold transition"
                style={
                  active
                    ? { background: t.accentColor, color: "#fff" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }
                }
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Native preview */}
      <div className="flex-1 overflow-y-auto">
        <TemplatePreview
          businessType={category.id as "barbershop" | "nail-salon"}
          themeId={activeThemeId}
        />
      </div>
    </div>
  );
}

/* ─── Category Card ─────────────────────────────────────────────────────── */
function CategoryCard({
  category,
  onPreview,
  onGetStarted,
}: {
  category: Category;
  onPreview: () => void;
  onGetStarted: () => void;
}) {
  const firstTheme = category.themes[0];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {firstTheme ? (
          <img
            src={firstTheme.heroImage}
            alt={category.label}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: "brightness(0.8)" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-7xl opacity-10">{category.emoji}</span>
          </div>
        )}

        {/* Style count badge */}
        {category.themes.length > 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {category.themes.length} styles
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={onPreview}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-50 active:scale-95"
          >
            Preview
          </button>
          <button
            onClick={onGetStarted}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.emoji}</span>
          <p className="font-extrabold tracking-tight text-slate-900">{category.label}</p>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          {category.themes.length > 0
            ? `${category.themes.length} styles to choose from`
            : category.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onPreview}
            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Preview
          </button>
          <button
            onClick={onGetStarted}
            className="flex-1 rounded-lg bg-blue-600 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Coming Soon Card ───────────────────────────────────────────────────── */
function ComingSoonCard({ category }: { category: Category }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-white/60">
      <div className="relative aspect-[4/3] flex items-center justify-center bg-slate-50">
        <span className="text-8xl opacity-[0.06]">{category.emoji}</span>
        <span className="absolute rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-600">
          Coming soon
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl opacity-30">{category.emoji}</span>
          <p className="font-extrabold tracking-tight text-slate-300">{category.label}</p>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{category.description}</p>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function TemplatesPage() {
  const [, navigate] = useLocation();
  const loggedIn = isLoggedIn();
  const [previewCategory, setPreviewCategory] = useState<Category | null>(null);

  const handleGetStarted = () => navigate(loggedIn ? "/onboarding" : "/signup");

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Rocket className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">LaunchSite</span>
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(loggedIn ? "/app" : "/login")}
              className="font-semibold"
            >
              {loggedIn ? "Open studio" : "Sign in"}
            </Button>
            <Button
              onClick={handleGetStarted}
              className="gap-2 bg-blue-600 font-bold hover:bg-blue-700"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero text */}
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
            Template gallery
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            One design.<br />Dozens of styles.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Each template comes with multiple colour and font styles to match your brand. Click Preview to browse all styles — no account needed.
          </p>
        </div>

        {/* Card grid — one card per category */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) =>
            cat.available ? (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPreview={() => setPreviewCategory(cat)}
                onGetStarted={handleGetStarted}
              />
            ) : (
              <ComingSoonCard key={cat.id} category={cat} />
            )
          )}
        </div>

        {/* CTA band */}
        <div className="mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-center text-white md:p-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
            Found your style?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Create an account, answer a few questions about your business, and we build and launch your site — fully done for you.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="mt-8 h-14 gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-blue-700 hover:bg-blue-50"
          >
            Start my launch
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </main>

      {/* Preview modal */}
      {previewCategory && (
        <PreviewModal
          category={previewCategory}
          onClose={() => setPreviewCategory(null)}
          onGetStarted={() => { setPreviewCategory(null); handleGetStarted(); }}
        />
      )}
    </div>
  );
}
