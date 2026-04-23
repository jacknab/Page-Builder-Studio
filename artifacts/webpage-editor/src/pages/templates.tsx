import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import {
  BARBERSHOP_THEMES,
  BARBERSHOP2_THEMES,
  NAIL_SALON_THEMES,
  type LaunchsiteTemplate,
} from "@/lib/launchsiteTemplates";
import TemplatePreview, { type PreviewType } from "@/components/preview/TemplatePreview";

type CategoryId = "barbershop" | "nail-salon" | "hair-salon" | "haircut-studio";

interface TemplateDesign {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  themes: LaunchsiteTemplate[];
  previewType: PreviewType;
}

interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  available: boolean;
  description: string;
  designs: TemplateDesign[];
}

const CATEGORIES: Category[] = [
  {
    id: "hair-salon",
    label: "Hair Salon",
    emoji: "✂️",
    available: false,
    description: "Elegant sites for hair stylists and salons",
    designs: [],
  },
  {
    id: "nail-salon",
    label: "Nail Salon",
    emoji: "💅",
    available: true,
    description: "Polished, beautiful sites for nail studios",
    designs: [
      {
        id: "nail-salon-v1",
        name: "Nail Salon",
        description: "Soft, elegant design for nail studios",
        heroImage: NAIL_SALON_THEMES[0].heroImage,
        themes: NAIL_SALON_THEMES,
        previewType: "nail-salon",
      },
    ],
  },
  {
    id: "barbershop",
    label: "Barbershop",
    emoji: "💈",
    available: true,
    description: "Bold, sharp sites for barbershops",
    designs: [
      {
        id: "barbershop-v1",
        name: "Classic Barbershop",
        description: "Dark, luxury layout with gallery and team section",
        heroImage: BARBERSHOP_THEMES[0].heroImage,
        themes: BARBERSHOP_THEMES,
        previewType: "barbershop",
      },
      {
        id: "barbershop-v2",
        name: "Modern Barbershop",
        description: "Clean split-hero layout with reviews and booking CTA",
        heroImage: BARBERSHOP2_THEMES[0].heroImage,
        themes: BARBERSHOP2_THEMES,
        previewType: "barbershop2",
      },
    ],
  },
  {
    id: "haircut-studio",
    label: "Haircut Studio",
    emoji: "🪒",
    available: false,
    description: "Modern sites for haircut studios",
    designs: [],
  },
];

/* ─── Preview Modal ─────────────────────────────────────────────────────── */
function PreviewModal({
  design,
  categoryEmoji,
  onClose,
  onGetStarted,
}: {
  design: TemplateDesign;
  categoryEmoji: string;
  onClose: () => void;
  onGetStarted: () => void;
}) {
  const [activeThemeId, setActiveThemeId] = useState(design.themes[0]?.id ?? "");
  const activeTheme = design.themes.find((t) => t.id === activeThemeId) ?? design.themes[0];

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
            <span className="text-lg">{categoryEmoji}</span>
            <span className="text-sm font-bold text-white">{design.name}</span>
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
          {design.themes.map((t) => {
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
          previewType={design.previewType}
          themeId={activeThemeId}
        />
      </div>
    </div>
  );
}

/* ─── Design Card ────────────────────────────────────────────────────────── */
function DesignCard({
  design,
  categoryEmoji,
  onPreview,
  onGetStarted,
}: {
  design: TemplateDesign;
  categoryEmoji: string;
  onPreview: () => void;
  onGetStarted: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={design.heroImage}
          alt={design.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.8)" }}
        />

        {/* Style count badge */}
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {design.themes.length} styles
        </div>

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
          <span className="text-xl">{categoryEmoji}</span>
          <p className="font-extrabold tracking-tight text-slate-900">{design.name}</p>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{design.description}</p>
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
  const [selectedId, setSelectedId] = useState<CategoryId | null>(null);
  const [previewDesign, setPreviewDesign] = useState<{ design: TemplateDesign; categoryEmoji: string } | null>(null);

  const handleGetStarted = () => navigate(loggedIn ? "/onboarding" : "/signup");
  const selectedCategory = CATEGORIES.find((c) => c.id === selectedId) ?? null;

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
        <div className="mb-8 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">Templates</h1>
          <p className="mt-3 text-base text-slate-600">
            Select a category to browse designs.
          </p>
        </div>

        {/* Category buttons */}
        <div className="mb-10 flex flex-wrap gap-3 border-b border-slate-200 pb-6">
          {CATEGORIES.map((cat) => {
            const active = selectedId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedId(active ? null : cat.id)}
                disabled={!cat.available}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : cat.available
                    ? "bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                    : "cursor-not-allowed bg-white/50 text-slate-300"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
                {!cat.available && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-600">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Design cards — only shown after selecting a category */}
        {!selectedCategory && (
          <p className="text-sm text-slate-400">← Select a category above to see its designs.</p>
        )}

        {selectedCategory && (
          <div className="flex flex-wrap gap-6">
            {selectedCategory.designs.map((design) => (
              <div key={design.id} className="w-full max-w-xs">
                <DesignCard
                  design={design}
                  categoryEmoji={selectedCategory.emoji}
                  onPreview={() => setPreviewDesign({ design, categoryEmoji: selectedCategory.emoji })}
                  onGetStarted={handleGetStarted}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Preview modal */}
      {previewDesign && (
        <PreviewModal
          design={previewDesign.design}
          categoryEmoji={previewDesign.categoryEmoji}
          onClose={() => setPreviewDesign(null)}
          onGetStarted={() => { setPreviewDesign(null); handleGetStarted(); }}
        />
      )}
    </div>
  );
}
