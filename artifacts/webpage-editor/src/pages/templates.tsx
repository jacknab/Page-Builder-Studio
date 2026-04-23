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
  port: number;
  themes: LaunchsiteTemplate[];
  available: boolean;
}

const CATEGORIES: Category[] = [
  { id: "hair-salon",     label: "Hair Salon",      emoji: "✂️", port: 5175, themes: [],                available: false },
  { id: "nail-salon",     label: "Nail Salon",      emoji: "💅", port: 5173, themes: NAIL_SALON_THEMES, available: true },
  { id: "barbershop",     label: "Barbershop",      emoji: "💈", port: 6000, themes: BARBERSHOP_THEMES, available: true },
  { id: "haircut-studio", label: "Haircut Studio",  emoji: "🪒", port: 5176, themes: [],                available: false },
];

function PreviewModal({
  template,
  category,
  onClose,
  onGetStarted,
}: {
  template: LaunchsiteTemplate;
  category: Category;
  onClose: () => void;
  onGetStarted: () => void;
}) {
  const [activeThemeId, setActiveThemeId] = useState(template.id);
  const activeTheme = category.themes.find((t) => t.id === activeThemeId) ?? template;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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
            <span className="text-sm font-bold text-white">{activeTheme.name}</span>
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

      {/* Native preview — no iframe, no separate server needed */}
      <div className="flex-1 overflow-y-auto">
        <TemplatePreview
          businessType={category.id as "barbershop" | "nail-salon"}
          themeId={activeThemeId}
        />
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  category,
  onPreview,
  onGetStarted,
}: {
  template: LaunchsiteTemplate;
  category: Category;
  onPreview: () => void;
  onGetStarted: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={template.heroImage}
          alt={template.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ filter: "brightness(0.75)" }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(140deg, ${template.bgColor} 0%, transparent 55%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: template.accentColor }}
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow"
          style={{ background: template.accentColor, color: "#fff" }}
        >
          {template.style}
        </span>
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={onPreview}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-50"
          >
            Preview
          </button>
          <button
            onClick={onGetStarted}
            className="rounded-xl px-4 py-2 text-sm font-bold text-white shadow-lg transition"
            style={{ background: template.accentColor }}
          >
            Use This
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="font-extrabold tracking-tight text-slate-900">{template.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{template.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onPreview}
            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Preview
          </button>
          <button
            onClick={onGetStarted}
            className="flex-1 rounded-lg py-1.5 text-xs font-bold text-white transition"
            style={{ background: template.accentColor }}
          >
            Use This
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [, navigate] = useLocation();
  const loggedIn = isLoggedIn();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [preview, setPreview] = useState<{ template: LaunchsiteTemplate; category: Category } | null>(null);

  const handleGetStarted = () => navigate(loggedIn ? "/onboarding" : "/signup");

  const visibleCategories =
    activeFilter === "all"
      ? CATEGORIES.filter((c) => c.available)
      : CATEGORIES.filter((c) => c.id === activeFilter);

  const totalAvailable = CATEGORIES.filter((c) => c.available).reduce(
    (sum, c) => sum + c.themes.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-slate-950">
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
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
            Template gallery
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            {totalAvailable} designs.<br />Find yours.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Browse every design style across all business types. Click any card to preview the full live site, then get started — no account needed to look around.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeFilter === "all"
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
            }`}
          >
            All designs
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => cat.available && setActiveFilter(cat.id)}
              disabled={!cat.available}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
                activeFilter === cat.id
                  ? "bg-slate-900 text-white shadow"
                  : cat.available
                  ? "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                  : "cursor-not-allowed bg-white/50 text-slate-300"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              {!cat.available && (
                <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {visibleCategories.map((cat) => (
            <section key={cat.id}>
              <div className="mb-6 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{cat.label}</h2>
                    <p className="text-sm text-slate-500">
                      {cat.themes.length} design{cat.themes.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.themes.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    category={cat}
                    onPreview={() => setPreview({ template: tpl, category: cat })}
                    onGetStarted={handleGetStarted}
                  />
                ))}
              </div>
            </section>
          ))}

          {CATEGORIES.filter((c) => !c.available && (activeFilter === "all" || activeFilter === c.id)).map((cat) => (
            <section key={cat.id}>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl opacity-30">{cat.emoji}</span>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-300">{cat.label}</h2>
                  <p className="text-sm font-bold text-amber-500">Coming soon</p>
                </div>
              </div>
              <div className="flex items-center gap-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-8 py-10">
                <span className="text-5xl opacity-10">{cat.emoji}</span>
                <div>
                  <p className="text-lg font-black text-slate-300">Designs in progress</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {cat.label} templates are being designed. Check back soon.
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

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

      {preview && (
        <PreviewModal
          template={preview.template}
          category={preview.category}
          onClose={() => setPreview(null)}
          onGetStarted={() => { setPreview(null); handleGetStarted(); }}
        />
      )}
    </div>
  );
}
