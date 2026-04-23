import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Rocket, X, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import {
  BARBERSHOP_THEMES,
  BARBERSHOP2_THEMES,
  BARBERSHOP3_THEMES,
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
      {
        id: "barbershop-v3",
        name: "Walk-In & Check-In",
        description: "Classic luxury design with a built-in online check-in queue",
        heroImage: BARBERSHOP3_THEMES[0].heroImage,
        themes: BARBERSHOP3_THEMES,
        previewType: "barbershop3",
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const activeTheme = design.themes.find((t) => t.id === activeThemeId) ?? design.themes[0];
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pickerOpen) setPickerOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, pickerOpen]);

  /* Close picker when clicking outside */
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  if (!activeTheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0a0a" }}>
      {/* Slim header — no pills */}
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
            <span className="text-sm text-white/30">·</span>
            <span className="text-sm text-white/60">{activeTheme.name}</span>
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
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-y-auto">
        <TemplatePreview
          previewType={design.previewType}
          themeId={activeThemeId}
        />
      </div>

      {/* Floating palette button + theme picker */}
      <div ref={pickerRef} className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        {/* Theme picker panel — slides up when open */}
        {pickerOpen && (
          <div
            className="flex max-h-[60vh] w-56 flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="border-b px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                {design.themes.length} styles
              </p>
            </div>
            <div className="overflow-y-auto">
              {design.themes.map((t) => {
                const active = t.id === activeThemeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setActiveThemeId(t.id); setPickerOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                  >
                    {/* Color swatch */}
                    <span
                      className="h-5 w-5 flex-shrink-0 rounded-full border-2"
                      style={{
                        background: t.accentColor,
                        borderColor: active ? "#fff" : "transparent",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${active ? "text-white" : "text-white/70"}`}>
                        {t.name}
                      </p>
                      <p className="text-[10px] text-white/30 truncate">{t.style}</p>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 flex-shrink-0 text-white/60" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Palette trigger button */}
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition hover:scale-105 active:scale-95"
          style={{
            background: activeTheme.accentColor,
            color: "#fff",
            boxShadow: `0 8px 32px ${activeTheme.accentColor}66`,
          }}
          title="Change style"
        >
          <Palette className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

/* ─── Design Card ────────────────────────────────────────────────────────── */
function DesignCard({
  design,
  categoryEmoji,
  onPreview,
}: {
  design: TemplateDesign;
  categoryEmoji: string;
  onPreview: () => void;
}) {
  return (
    <button
      onClick={onPreview}
      className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl text-left cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={design.heroImage}
          alt={design.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.8)" }}
        />
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {design.themes.length} styles
        </div>
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>

      {/* Card footer */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryEmoji}</span>
          <p className="font-extrabold tracking-tight text-slate-900">{design.name}</p>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{design.description}</p>
      </div>
    </button>
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
