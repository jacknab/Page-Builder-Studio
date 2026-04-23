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
  Check,
  Clock,
  Facebook,
  Globe2,
  Instagram,
  Loader2,
  MapPin,
  Plus,
  Rocket,
  Share2,
  Trash2,
  X,
} from "lucide-react";

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Template",
  "About you",
  "Services",
  "Hours",
  "Links",
];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((label, i) => {
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
            {i < TOTAL_STEPS - 1 && (
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
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:${port}/?theme=${themeId}`;
  }
  const newHost = hostname.replace(/^\d+/, String(port));
  return `${protocol}//${newHost}/?theme=${themeId}`;
}

const THEMES_BY_TYPE: Record<string, LaunchsiteTemplate[]> = {
  "barbershop": BARBERSHOP_THEMES,
  "nail-salon": NAIL_SALON_THEMES,
};

// ─── PREVIEW MODAL ─────────────────────────────────────────────────────────
function PreviewModal({
  category,
  onClose,
  onSelect,
}: {
  category: TemplateCategoryConfig;
  onClose: () => void;
  onSelect: (themeId: string) => void;
}) {
  const themes = THEMES_BY_TYPE[category.type] ?? [];
  const [activeThemeId, setActiveThemeId] = useState(themes[0]?.id ?? "");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeSrc = getTemplateUrl(category.port, themes[0]?.id ?? "");

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
      {/* Top bar */}
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-white/10 bg-[#111] px-4">
        <button
          onClick={onClose}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-base">{category.emoji}</span>
          <span className="hidden sm:block text-sm font-bold text-white">{category.label}</span>
        </div>

        <div className="mx-2 h-4 w-px flex-shrink-0 bg-white/20" />

        {/* Scrollable theme pills */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition"
              style={{
                backgroundColor: activeThemeId === t.id ? t.accentColor : "rgba(255,255,255,0.08)",
                color: activeThemeId === t.id ? t.bgColor : "#cbd5e1",
                border: `1px solid ${activeThemeId === t.id ? t.accentColor : "rgba(255,255,255,0.12)"}`,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect(activeThemeId)}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500"
        >
          <Check className="h-3.5 w-3.5" />
          Select
        </button>
      </div>

      {/* Active theme label */}
      {activeTheme && (
        <div className="flex items-center gap-2 bg-[#111] px-4 pb-2 pt-0.5">
          <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeTheme.accentColor }} />
          <span className="text-xs text-slate-400">{activeTheme.name} — {activeTheme.description}</span>
        </div>
      )}

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
  selected,
  onPreview,
}: {
  selected: { id: string; source: "blocks" | "html" | "launchsite" } | null;
  onPreview: (category: TemplateCategoryConfig) => void;
}) {
  const selectedCategory = selected
    ? TEMPLATE_CATEGORIES.find((c) => THEMES_BY_TYPE[c.type]?.some((t) => t.id === selected.id))
    : null;
  const selectedTheme = selected
    ? Object.values(THEMES_BY_TYPE).flat().find((t) => t.id === selected.id)
    : null;

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Pick your template</h2>
      <p className="mt-2 text-base text-slate-500">
        Choose your business type to browse and preview real designs.
      </p>

      {selected && selectedTheme && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="h-8 w-8 rounded-full flex-shrink-0" style={{ backgroundColor: selectedTheme.accentColor }} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-blue-700">{selectedTheme.name} selected</p>
            <p className="text-xs text-blue-500">{selectedCategory?.label} — {selectedTheme.description}</p>
          </div>
          <button
            onClick={() => {
              const cat = TEMPLATE_CATEGORIES.find((c) => c.type === selectedCategory?.type);
              if (cat) onPreview(cat);
            }}
            className="ml-auto flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
          >
            Change
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.type}
            disabled={!cat.available}
            onClick={() => cat.available && onPreview(cat)}
            className={`group relative overflow-hidden rounded-3xl text-left transition ${
              cat.available
                ? "hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                : "cursor-not-allowed opacity-60"
            } ${
              selectedCategory?.type === cat.type
                ? "ring-2 ring-blue-600 ring-offset-2"
                : ""
            }`}
          >
            <div className="relative h-52 bg-slate-100">
              <img
                src={cat.heroImage}
                alt={cat.label}
                className="h-full w-full object-cover transition group-hover:scale-105"
                style={{ filter: cat.available ? "brightness(0.75)" : "brightness(0.5) grayscale(0.4)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {!cat.available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    Coming Soon
                  </span>
                </div>
              )}

              {selectedCategory?.type === cat.type && (
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xl font-black text-white">
                      {cat.emoji} {cat.label}
                    </p>
                    <p className="mt-0.5 text-sm text-white/70">{cat.description}</p>
                  </div>
                  {cat.available && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      {(THEMES_BY_TYPE[cat.type]?.length ?? 0)} styles
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
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
  const [previewCategory, setPreviewCategory] = useState<TemplateCategoryConfig | null>(null);

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


  const canAdvance = () => {
    if (step === 1) return templateId !== null;
    if (step === 2) return businessName.trim().length > 0;
    return true;
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
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
          <StepIndicator step={step} />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          {step === 1 && (
            <TemplatePicker
              selected={templateId ? { id: templateId, source: templateSource } : null}
              onPreview={setPreviewCategory}
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
          {step === 5 && (
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
              {step < TOTAL_STEPS && (
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
                {step === TOTAL_STEPS ? (
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
          Step {step} of {TOTAL_STEPS} · You can update all of this later from your dashboard.
        </p>
      </main>

      {previewCategory && (
        <PreviewModal
          category={previewCategory}
          onClose={() => setPreviewCategory(null)}
          onSelect={handlePreviewSelect}
        />
      )}
    </div>
  );
}
