import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  BARBERSHOP_THEMES,
  NAIL_SALON_THEMES,
  TEMPLATE_CATEGORIES,
  type LaunchsiteTemplate,
  type TemplateCategory as TemplateCategoryConfig,
} from "@/lib/launchsiteTemplates";
import {
  PRESET_SERVICES,
  DEFAULT_DESCRIPTIONS,
  DEFAULT_HOURS,
  EMPTY_SOCIAL,
  saveOnboarding,
  type BusinessType,
  type ServiceItem,
  type BarberItem,
  type LocationItem,
  type BusinessHours,
  type OnboardingData,
} from "@/lib/onboardingData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clock,
  Facebook,
  Globe2,
  Instagram,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Rocket,
  Share2,
  Trash2,
  User,
  X,
} from "lucide-react";

const DEFAULT_STEP_LABELS = ["Template", "About you", "Services", "Hours", "Locations", "Links"];
const BARBERSHOP_STEP_LABELS = ["Template", "About you", "Services", "Hours", "Barbers", "Locations", "Links"];

function StepIndicator({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {labels.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold transition-colors ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : num}
              </div>
              <span
                className={`hidden text-[10px] font-semibold sm:block ${
                  active ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className={`mb-4 h-0.5 w-8 flex-shrink-0 rounded-full sm:w-12 ${
                  done ? "bg-green-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TEMPLATE URL HELPER ───────────────────────────────────────────────────
function getTemplateUrl(port: number, themeId: string): string {
  const { hostname, protocol } = window.location;
  // Works for both localhost and Replit — Replit exposes additional ports
  // via hostname:port (e.g. https://abc.replit.dev:5173/)
  return `${protocol}//${hostname}:${port}/?theme=${themeId}`;
}

const THEMES_BY_TYPE: Record<string, LaunchsiteTemplate[]> = {
  "barbershop": BARBERSHOP_THEMES,
  "nail-salon": NAIL_SALON_THEMES,
};

// ─── PREVIEW MODAL ─────────────────────────────────────────────────────────
function PreviewModal({
  category,
  initialThemeId,
  onClose,
  onSelect,
}: {
  category: TemplateCategoryConfig;
  initialThemeId?: string;
  onClose: () => void;
  onSelect: (themeId: string) => void;
}) {
  const themes = THEMES_BY_TYPE[category.type] ?? [];
  const startId = initialThemeId ?? themes[0]?.id ?? "";
  const [activeThemeId, setActiveThemeId] = useState(startId);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeSrc = getTemplateUrl(category.port, startId);

  useEffect(() => {
    setIframeLoaded(false);
  }, [category.type]);

  const switchTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    iframeRef.current?.contentWindow?.postMessage({ type: "SET_THEME", themeId }, "*");
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const activeTheme = themes.find((t) => t.id === activeThemeId) ?? themes[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header: two rows */}
      <div className="flex-shrink-0 bg-[#0f0f0f] border-b border-white/[0.07]">

        {/* Row 1 — controls */}
        <div className="flex h-11 items-center gap-2 px-3">
          {/* Close */}
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Category label */}
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-sm leading-none">{category.emoji}</span>
            <span className="hidden sm:block text-xs font-semibold text-white/70">
              {category.label}
            </span>
          </div>

          <div className="flex-1" />

          {/* Active theme description — subtle, desktop only */}
          {activeTheme && (
            <div className="hidden lg:flex shrink-0 items-center gap-1.5 max-w-[220px]">
              <div
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: activeTheme.accentColor }}
              />
              <span className="truncate text-[10px] text-white/35">
                {activeTheme.description}
              </span>
            </div>
          )}

          {/* Select CTA */}
          <button
            onClick={() => onSelect(activeThemeId)}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500 active:scale-95"
          >
            <Check className="h-3 w-3" />
            Select
          </button>
        </div>

        {/* Row 2 — theme pills (wrapping, no scroll) */}
        <div className="flex flex-wrap gap-1.5 px-3 pb-2.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              className="rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all"
              style={{
                backgroundColor: activeThemeId === t.id ? t.accentColor : "transparent",
                color: activeThemeId === t.id ? t.bgColor : "rgba(255,255,255,0.5)",
                border: `1px solid ${activeThemeId === t.id ? t.accentColor : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* iframe */}
      <div className="relative flex-1 bg-black">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-slate-400">Loading preview…</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          className="h-full w-full border-none"
          onLoad={() => setIframeLoaded(true)}
          title="Template preview"
        />
      </div>
    </div>
  );
}

// ─── STEP 1: TEMPLATE PICKER ───────────────────────────────────────────────
function TemplatePicker({
  selectedId,
  onSelect,
  onPreview,
}: {
  selectedId: string | null;
  onSelect: (themeId: string, businessType: BusinessType) => void;
  onPreview: (category: TemplateCategoryConfig, initialThemeId: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const availableCategories = TEMPLATE_CATEGORIES.filter((c) => c.available);
  const visibleCategories =
    filter === "all" ? availableCategories : availableCategories.filter((c) => c.type === filter);

  const selectedTheme = selectedId
    ? Object.values(THEMES_BY_TYPE).flat().find((t) => t.id === selectedId)
    : null;
  const selectedCategory = selectedId
    ? TEMPLATE_CATEGORIES.find((c) => THEMES_BY_TYPE[c.type]?.some((t) => t.id === selectedId))
    : null;

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Pick your design</h2>
      <p className="mt-2 text-base text-slate-500">
        Browse every style below. Hit Preview to see the full live site, then Select to use it.
      </p>

      {selectedTheme && selectedCategory && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div
            className="h-8 w-8 flex-shrink-0 rounded-full"
            style={{ backgroundColor: selectedTheme.accentColor }}
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-blue-700">{selectedTheme.name} — selected</p>
            <p className="text-xs text-blue-500">
              {selectedCategory.label} · {selectedTheme.style}
            </p>
          </div>
          <button
            onClick={() => onPreview(selectedCategory, selectedTheme.id)}
            className="ml-auto flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
          >
            Change
          </button>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All designs
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.type}
            onClick={() => setFilter(cat.type)}
            className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
              filter === cat.type
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-10">
        {visibleCategories.map((cat) => {
          const themes = THEMES_BY_TYPE[cat.type] ?? [];
          return (
            <section key={cat.type}>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="text-lg font-black">{cat.label}</h3>
                <span className="text-sm text-slate-400">{themes.length} designs</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {themes.map((tpl) => {
                  const isSelected = selectedId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-500 ring-offset-1"
                          : "border-slate-200 hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={tpl.heroImage}
                          alt={tpl.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          style={{ filter: "brightness(0.75)" }}
                        />
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(140deg, ${tpl.bgColor} 0%, transparent 60%)`,
                          }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{ background: tpl.accentColor }}
                        />
                        <span
                          className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow"
                          style={{ background: tpl.accentColor, color: "#fff" }}
                        >
                          {tpl.style}
                        </span>
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 shadow">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-extrabold text-slate-900">{tpl.name}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                          {tpl.description}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => onPreview(cat, tpl.id)}
                            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => onSelect(tpl.id, cat.type as BusinessType)}
                            className="flex-1 rounded-lg py-1.5 text-xs font-bold text-white transition"
                            style={
                              isSelected
                                ? { background: "#2563eb" }
                                : { background: tpl.accentColor }
                            }
                          >
                            {isSelected ? "Selected ✓" : "Select"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}


const TEAM_SIZE_LABEL: Record<string, string> = {
  "barbershop": "How many barbers do you have?",
  "hair-salon": "How many stylists do you have?",
  "haircut-studio": "How many stylists do you have?",
  "nail-salon": "How many nail technicians do you have?",
};

// ─── STEP 3: BUSINESS INFO ─────────────────────────────────────────────────
function BusinessInfo({
  businessType,
  name,
  tagline,
  description,
  established,
  teamSize,
  onTextChange,
  onEstablishedChange,
  onTeamSizeChange,
}: {
  businessType: BusinessType | null;
  name: string;
  tagline: string;
  description: string;
  established: number | null;
  teamSize: number | null;
  onTextChange: (field: "name" | "tagline" | "description", value: string) => void;
  onEstablishedChange: (value: number | null) => void;
  onTeamSizeChange: (value: number | null) => void;
}) {
  const teamLabel = businessType ? TEAM_SIZE_LABEL[businessType] : "How many staff members do you have?";

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Tell us about your business</h2>
      <p className="mt-2 text-base text-slate-500">
        This information will appear throughout your website.
      </p>
      <div className="mt-6 space-y-5">
        <div>
          <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Business name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Glamour Nails Studio"
            value={name}
            onChange={(e) => onTextChange("name", e.target.value)}
            className="h-11 text-base"
            autoFocus
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Tagline / short description
          </Label>
          <Input
            placeholder="e.g. Luxury nails for every occasion"
            value={tagline}
            onChange={(e) => onTextChange("tagline", e.target.value)}
            className="h-11 text-base"
          />
          <p className="mt-1.5 text-xs text-slate-400">Shown under your business name in the hero section.</p>
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
            About your business
          </Label>
          <Textarea
            placeholder="Tell visitors who you are, what you specialise in, and why they should choose you..."
            value={description}
            onChange={(e) => onTextChange("description", e.target.value)}
            className="min-h-[120px] resize-none text-base"
          />
          <p className="mt-1.5 text-xs text-slate-400">Used in the about / intro section of your site.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Year founded
            </Label>
            <Input
              type="number"
              placeholder="e.g. 2015"
              min={1900}
              max={new Date().getFullYear()}
              value={established ?? ""}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                onEstablishedChange(isNaN(v) ? null : v);
              }}
              className="h-11 text-base"
            />
            <p className="mt-1.5 text-xs text-slate-400">Shows "Est. XXXX" and years in business.</p>
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {teamLabel}
            </Label>
            <Input
              type="number"
              placeholder="e.g. 4"
              min={1}
              max={999}
              value={teamSize ?? ""}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                onTeamSizeChange(isNaN(v) ? null : v);
              }}
              className="h-11 text-base"
            />
            <p className="mt-1.5 text-xs text-slate-400">Shown in your about section.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 4: SERVICES ──────────────────────────────────────────────────────
function ServicesEditor({
  services,
  onChange,
}: {
  services: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
}) {
  const addService = () => {
    onChange([
      ...services,
      { id: Math.random().toString(36).slice(2, 9), name: "", price: "" },
    ]);
  };

  const updateService = (id: string, field: "name" | "price", value: string) => {
    onChange(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeService = (id: string) => {
    onChange(services.filter((s) => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Your services & prices</h2>
      <p className="mt-2 text-base text-slate-500">
        We've pre-filled these based on your business type. Edit, delete, or add anything to match what you actually offer. Price is optional — leave it blank to hide it, or type anything like{" "}
        <span className="font-semibold text-slate-700">"Call for details"</span> or{" "}
        <span className="font-semibold text-slate-700">"$30–$50"</span>.
      </p>

      <div className="mt-6 space-y-2.5">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
              {index + 1}
            </div>
            <Input
              placeholder="Service name"
              value={service.name}
              onChange={(e) => updateService(service.id, "name", e.target.value)}
              className="h-9 flex-1 border-slate-200 bg-slate-50 text-sm"
            />
            <Input
              placeholder="Price (optional)"
              value={service.price}
              onChange={(e) => updateService(service.id, "price", e.target.value)}
              className="h-9 w-40 border-slate-200 bg-slate-50 text-sm"
            />
            <button
              onClick={() => removeService(service.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          onClick={addService}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-bold text-slate-500 transition hover:border-blue-400 hover:text-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add a service
        </button>
      </div>
    </div>
  );
}

// ─── STEP 5: HOURS ─────────────────────────────────────────────────────────
function HoursEditor({
  hours,
  onChange,
}: {
  hours: BusinessHours[];
  onChange: (hours: BusinessHours[]) => void;
}) {
  const update = (day: string, field: keyof BusinessHours, value: string | boolean) => {
    onChange(hours.map((h) => (h.day === day ? { ...h, [field]: value } : h)));
  };

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Business hours</h2>
      <p className="mt-2 text-base text-slate-500">
        Toggle each day open or closed, then set your hours.
      </p>
      <div className="mt-6 space-y-2">
        {hours.map((h) => (
          <div
            key={h.day}
            className={`flex flex-wrap items-center gap-3 rounded-xl border p-4 transition ${
              h.open ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50"
            }`}
          >
            <button
              onClick={() => update(h.day, "open", !h.open)}
              className={`flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${
                h.open ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  h.open ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`w-24 text-sm font-extrabold ${h.open ? "text-slate-900" : "text-slate-400"}`}>
              {h.day}
            </span>
            {h.open ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="time"
                    value={h.openTime}
                    onChange={(e) => update(h.day, "openTime", e.target.value)}
                    className="text-sm font-semibold text-slate-700 outline-none"
                  />
                </div>
                <span className="text-xs text-slate-400">to</span>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="time"
                    value={h.closeTime}
                    onChange={(e) => update(h.day, "closeTime", e.target.value)}
                    className="text-sm font-semibold text-slate-700 outline-none"
                  />
                </div>
              </div>
            ) : (
              <span className="text-sm font-semibold text-slate-400">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 5/6: LOCATIONS ────────────────────────────────────────────────────
const newLocation = (): LocationItem => ({
  id: Math.random().toString(36).slice(2, 9),
  name: "",
  address: "",
  phone: "",
});

function LocationsEditor({
  locations,
  onChange,
}: {
  locations: LocationItem[];
  onChange: (locations: LocationItem[]) => void;
}) {
  const isMulti = locations.length > 1;

  const update = (id: string, field: keyof Omit<LocationItem, "id">, value: string) => {
    onChange(locations.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const remove = (id: string) => {
    if (locations.length <= 1) return;
    onChange(locations.filter((l) => l.id !== id));
  };

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Your location{isMulti ? "s" : ""}</h2>
      <p className="mt-2 text-base text-slate-500">
        {isMulti
          ? "Each location will get its own section on your site with an address and phone number."
          : "Where are you based? This appears in the contact section of your site."}
      </p>

      <div className="mt-6 space-y-4">
        {locations.map((loc, idx) => (
          <div
            key={loc.id}
            className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-700">
                {isMulti ? `Location ${idx + 1}` : "Store address"}
              </p>
              {locations.length > 1 && (
                <button
                  onClick={() => remove(loc.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Remove location"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Location nickname — only shown when multi */}
              {isMulti && (
                <div>
                  <Label className="mb-1 block text-xs font-semibold text-slate-600">
                    Location name <span className="text-slate-400 font-normal">(e.g. Downtown, North Side)</span>
                  </Label>
                  <Input
                    placeholder="e.g. Downtown"
                    value={loc.name}
                    onChange={(e) => update(loc.id, "name", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              )}

              {/* Address */}
              <div>
                <Label className="mb-1 block text-xs font-semibold text-slate-600">
                  <MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-500" />
                  Street address <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. 123 Main Street, Chicago, IL 60601"
                  value={loc.address}
                  onChange={(e) => update(loc.id, "address", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="mb-1 block text-xs font-semibold text-slate-600">
                  <Phone className="mr-1 inline h-3.5 w-3.5 text-blue-500" />
                  Phone number
                </Label>
                <Input
                  type="tel"
                  placeholder="e.g. (312) 555-0100"
                  value={loc.phone}
                  onChange={(e) => update(loc.id, "phone", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => onChange([...locations, newLocation()])}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-4 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add another location
        </button>

        {isMulti && (
          <p className="text-center text-xs text-slate-400">
            Your site will show a dedicated section listing all your locations.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── STEP 5b: BARBERS (barbershop only) ─────────────────────────────────────
const newBarber = (): BarberItem => ({
  id: Math.random().toString(36).slice(2, 9),
  name: "",
  bio: "",
  photoUrl: "",
});

function BarbersEditor({
  barbers,
  onChange,
}: {
  barbers: BarberItem[];
  onChange: (barbers: BarberItem[]) => void;
}) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const update = (id: string, field: keyof Omit<BarberItem, "id">, value: string) => {
    onChange(barbers.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const remove = (id: string) => onChange(barbers.filter((b) => b.id !== id));

  const handlePhoto = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => update(id, "photoUrl", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Meet the team</h2>
          <p className="mt-2 text-base text-slate-500">
            Add your barbers so clients know who they're booking with. This section is{" "}
            <span className="font-semibold text-slate-700">optional</span> — skip it if you'd rather leave it out.
          </p>
        </div>
        <span className="mt-1 shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
          Optional
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <button
              onClick={() => remove(barber.id)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Remove barber"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="flex gap-4">
              {/* Photo */}
              <div className="shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileRefs.current[barber.id] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhoto(barber.id, file);
                  }}
                />
                <button
                  onClick={() => fileRefs.current[barber.id]?.click()}
                  className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  {barber.photoUrl ? (
                    <>
                      <img
                        src={barber.photoUrl}
                        alt={barber.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-blue-500 transition-colors">
                      <User className="h-6 w-6" />
                      <span className="text-[10px] font-semibold">Photo</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Name + Bio */}
              <div className="flex-1 space-y-3">
                <div>
                  <Label className="mb-1 block text-xs font-semibold text-slate-600">Name</Label>
                  <Input
                    placeholder="e.g. Marcus Johnson"
                    value={barber.name}
                    onChange={(e) => update(barber.id, "name", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-semibold text-slate-600">Short bio</Label>
                  <Textarea
                    placeholder="e.g. 8 years experience, specialises in fades and beard work."
                    value={barber.bio}
                    onChange={(e) => update(barber.id, "bio", e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => onChange([...barbers, newBarber()])}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-4 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add a barber
        </button>
      </div>
    </div>
  );
}

// ─── STEP 6: LINKS ─────────────────────────────────────────────────────────
function LinksEditor({
  googleUrl,
  social,
  onGoogleChange,
  onSocialChange,
}: {
  googleUrl: string;
  social: OnboardingData["social"];
  onGoogleChange: (val: string) => void;
  onSocialChange: (field: keyof OnboardingData["social"], val: string) => void;
}) {
  const socialFields: { key: keyof OnboardingData["social"]; label: string; icon: React.ElementType; placeholder: string }[] = [
    { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourbusiness" },
    { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourbusiness" },
    { key: "tiktok", label: "TikTok", icon: Share2, placeholder: "https://tiktok.com/@yourbusiness" },
    { key: "yelp", label: "Yelp", icon: MapPin, placeholder: "https://yelp.com/biz/your-business" },
    { key: "other", label: "Other link", icon: Globe2, placeholder: "https://..." },
  ];

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Your links</h2>
      <p className="mt-2 text-base text-slate-500">
        Add your Google listing and social profiles. All fields are optional — we'll only include what you provide.
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
            <MapPin className="mr-1.5 inline h-4 w-4 text-blue-500" />
            Google Business listing URL
          </Label>
          <Input
            placeholder="https://maps.google.com/?cid=..."
            value={googleUrl}
            onChange={(e) => onGoogleChange(e.target.value)}
            className="h-11 text-base"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Find your link by searching your business on Google Maps and copying the URL.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-4 text-sm font-extrabold text-slate-700">Social media profiles</p>
          <div className="space-y-3">
            {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={placeholder}
                    value={social[key]}
                    onChange={(e) => onSocialChange(key, e.target.value)}
                    className="h-9 border-slate-200 bg-white text-sm"
                    aria-label={label}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ONBOARDING PAGE ──────────────────────────────────────────────────
export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateSource, setTemplateSource] = useState<"blocks" | "html" | "launchsite">("launchsite");
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [established, setEstablished] = useState<number | null>(null);
  const [teamSize, setTeamSize] = useState<number | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [hours, setHours] = useState<BusinessHours[]>(DEFAULT_HOURS);
  const [googleUrl, setGoogleUrl] = useState("");
  const [social, setSocial] = useState(EMPTY_SOCIAL);
  const [locations, setLocations] = useState<LocationItem[]>([newLocation()]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [previewCategory, setPreviewCategory] = useState<TemplateCategoryConfig | null>(null);
  const [previewInitialThemeId, setPreviewInitialThemeId] = useState<string>("");

  const isBarbershop = businessType === "barbershop";
  const stepLabels = isBarbershop ? BARBERSHOP_STEP_LABELS : DEFAULT_STEP_LABELS;
  const totalSteps = stepLabels.length;
  const barbersStep = isBarbershop ? 5 : null;
  const locationsStep = isBarbershop ? 6 : 5;
  const linksStep = isBarbershop ? 7 : 6;

  const handleSelectTemplate = (id: string, source: "blocks" | "html" | "launchsite", bType: BusinessType) => {
    setTemplateId(id);
    setTemplateSource(source);
    if (bType && bType !== businessType) {
      setBusinessType(bType);
      setServices(
        PRESET_SERVICES[bType].map((s) => ({
          ...s,
          id: Math.random().toString(36).slice(2, 9),
        }))
      );
    }
  };

  const handlePreviewSelect = (themeId: string) => {
    if (!previewCategory) return;
    const bType = previewCategory.type as BusinessType;
    handleSelectTemplate(themeId, "launchsite", bType);
    if (!description.trim()) {
      setDescription(DEFAULT_DESCRIPTIONS[bType] ?? "");
    }
    setPreviewCategory(null);
    setStep(2);
  };

  const handleDirectSelect = (themeId: string, bType: BusinessType) => {
    handleSelectTemplate(themeId, "launchsite", bType);
    if (!description.trim()) {
      setDescription(DEFAULT_DESCRIPTIONS[bType] ?? "");
    }
  };


  const canAdvance = () => {
    if (step === 1) return templateId !== null;
    if (step === 2) return businessName.trim().length > 0;
    if (step === locationsStep) return locations.some((l) => l.address.trim().length > 0);
    return true;
  };

  const next = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else finish();
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const finish = () => {
    if (!templateId || !businessType) return;

    const data: OnboardingData = {
      templateId,
      templateSource,
      businessType,
      businessName,
      tagline,
      description,
      established,
      teamSize,
      services,
      hours,
      locations,
      barbers: isBarbershop ? barbers : [],
      googleListingUrl: googleUrl,
      social,
    };

    saveOnboarding(data);

    const STORAGE_KEY = "webpage-editor-sites-v2";
    const siteName = businessName.trim() || "My Business";
    const slug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "my-site";

    const site = {
      id: Math.random().toString(36).slice(2, 9),
      name: siteName,
      slug,
      status: "draft",
      source: templateSource,
      templateId,
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([site]));
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <header className="border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">LaunchSite</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
            Exit setup
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex justify-center">
          <StepIndicator step={step} labels={stepLabels} />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          {step === 1 && (
            <TemplatePicker
              selectedId={templateId}
              onSelect={handleDirectSelect}
              onPreview={(cat, themeId) => {
                setPreviewCategory(cat);
                setPreviewInitialThemeId(themeId);
              }}
            />
          )}
          {step === 2 && (
            <BusinessInfo
              businessType={businessType}
              name={businessName}
              tagline={tagline}
              description={description}
              established={established}
              teamSize={teamSize}
              onTextChange={(field, val) => {
                if (field === "name") setBusinessName(val);
                else if (field === "tagline") setTagline(val);
                else setDescription(val);
              }}
              onEstablishedChange={setEstablished}
              onTeamSizeChange={setTeamSize}
            />
          )}
          {step === 3 && <ServicesEditor services={services} onChange={setServices} />}
          {step === 4 && <HoursEditor hours={hours} onChange={setHours} />}
          {barbersStep !== null && step === barbersStep && (
            <BarbersEditor barbers={barbers} onChange={setBarbers} />
          )}
          {step === locationsStep && (
            <LocationsEditor locations={locations} onChange={setLocations} />
          )}
          {step === linksStep && (
            <LinksEditor
              googleUrl={googleUrl}
              social={social}
              onGoogleChange={setGoogleUrl}
              onSocialChange={(field, val) => setSocial((s) => ({ ...s, [field]: val }))}
            />
          )}

          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 1}
              className="gap-2 text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {step < totalSteps && (
                <button
                  onClick={next}
                  disabled={!canAdvance()}
                  className="text-sm font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-40"
                >
                  Skip for now
                </button>
              )}
              <Button
                onClick={next}
                disabled={!canAdvance()}
                className="gap-2 bg-blue-600 px-6 font-bold hover:bg-blue-700 disabled:opacity-40"
              >
                {step === totalSteps ? (
                  <>
                    Launch my site
                    <Rocket className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Step {step} of {totalSteps} · You can update all of this later from your dashboard.
        </p>
      </main>

      {previewCategory && (
        <PreviewModal
          category={previewCategory}
          initialThemeId={previewInitialThemeId}
          onClose={() => setPreviewCategory(null)}
          onSelect={handlePreviewSelect}
        />
      )}
    </div>
  );
}
