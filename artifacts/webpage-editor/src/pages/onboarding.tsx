import { useState } from "react";
import { useLocation } from "wouter";
import { TEMPLATES } from "@/lib/templates";
import { HTML_TEMPLATES } from "@/lib/htmlTemplates";
import {
  BUSINESS_TYPES,
  PRESET_SERVICES,
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
  MapPin,
  Plus,
  Rocket,
  Share2,
  Trash2,
  X,
} from "lucide-react";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Template",
  "Business type",
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

// ─── STEP 1: TEMPLATE PICKER ───────────────────────────────────────────────
function TemplatePicker({
  selected,
  onSelect,
}: {
  selected: { id: string; source: "blocks" | "html" } | null;
  onSelect: (id: string, source: "blocks" | "html") => void;
}) {
  const all = [
    ...TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      source: "blocks" as const,
      html: null as string | null,
      imageUrl: String(
        t.blocks.find((b) => b.type === "hero" || b.type === "image")?.props.imageUrl ?? ""
      ),
    })),
    ...HTML_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      source: "html" as const,
      html: t.html as string | null,
      imageUrl: "",
    })),
  ];

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">Pick your template</h2>
      <p className="mt-2 text-base text-slate-500">
        Choose the design that best fits your business. You can swap it later.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((t) => {
          const isSelected = selected?.id === t.id && selected?.source === t.source;
          return (
            <button
              key={`${t.source}-${t.id}`}
              onClick={() => onSelect(t.id, t.source)}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                isSelected ? "border-blue-600 shadow-lg shadow-blue-600/10" : "border-slate-200"
              }`}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="h-40 overflow-hidden bg-slate-100">
                {t.html ? (
                  <iframe
                    title={t.name}
                    srcDoc={t.html}
                    className="pointer-events-none h-[520px] w-full border-0"
                    style={{ transform: "scale(0.28)", transformOrigin: "top left", width: "358%" }}
                  />
                ) : t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 to-slate-950 p-6 text-center text-white">
                    <p className="text-xl font-black">{t.name}</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-extrabold tracking-tight">{t.name}</p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 2: BUSINESS TYPE ─────────────────────────────────────────────────
function BusinessTypePicker({
  selected,
  onSelect,
}: {
  selected: BusinessType | null;
  onSelect: (type: BusinessType) => void;
}) {
  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight">What type of business is it?</h2>
      <p className="mt-2 text-base text-slate-500">
        We'll pre-fill your services list based on your business type so you don't start from scratch.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {BUSINESS_TYPES.map((bt) => {
          const isSelected = selected === bt.id;
          return (
            <button
              key={bt.id}
              onClick={() => onSelect(bt.id)}
              className={`relative rounded-2xl border-2 p-6 text-left transition hover:shadow-md ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-600/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
              <span className="text-4xl">{bt.emoji}</span>
              <h3 className={`mt-3 text-xl font-extrabold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                {bt.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{bt.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 3: BUSINESS INFO ─────────────────────────────────────────────────
function BusinessInfo({
  name,
  tagline,
  description,
  onChange,
}: {
  name: string;
  tagline: string;
  description: string;
  onChange: (field: "name" | "tagline" | "description", value: string) => void;
}) {
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
            onChange={(e) => onChange("name", e.target.value)}
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
            onChange={(e) => onChange("tagline", e.target.value)}
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
            onChange={(e) => onChange("description", e.target.value)}
            className="min-h-[120px] resize-none text-base"
          />
          <p className="mt-1.5 text-xs text-slate-400">Used in the about / intro section of your site.</p>
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
  const [templateSource, setTemplateSource] = useState<"blocks" | "html">("blocks");
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [hours, setHours] = useState<BusinessHours[]>(DEFAULT_HOURS);
  const [googleUrl, setGoogleUrl] = useState("");
  const [social, setSocial] = useState(EMPTY_SOCIAL);

  const handleSelectTemplate = (id: string, source: "blocks" | "html") => {
    setTemplateId(id);
    setTemplateSource(source);
  };

  const handleSelectBusinessType = (type: BusinessType) => {
    setBusinessType(type);
    if (services.length === 0) {
      setServices(
        PRESET_SERVICES[type].map((s) => ({
          ...s,
          id: Math.random().toString(36).slice(2, 9),
        }))
      );
    } else {
      const confirmed = window.confirm(
        "Changing your business type will replace your current service list with a new preset. Continue?"
      );
      if (confirmed) {
        setServices(
          PRESET_SERVICES[type].map((s) => ({
            ...s,
            id: Math.random().toString(36).slice(2, 9),
          }))
        );
      }
    }
  };

  const canAdvance = () => {
    if (step === 1) return templateId !== null;
    if (step === 2) return businessType !== null;
    if (step === 3) return businessName.trim().length > 0;
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
      services,
      hours,
      googleListingUrl: googleUrl,
      social,
    };

    saveOnboarding(data);

    const STORAGE_KEY = "webpage-editor-sites-v2";
    const siteName = businessName.trim() || "My Business";
    const slug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "my-site";

    let blocks: any[] = [];
    let html: string | undefined;

    if (templateSource === "blocks") {
      const tpl = TEMPLATES.find((t) => t.id === templateId);
      if (tpl) {
        blocks = tpl.blocks.map((b) => ({
          ...b,
          id: Math.random().toString(36).slice(2, 9),
          props: JSON.parse(JSON.stringify(b.props)),
        }));
      }
    } else {
      const tpl = HTML_TEMPLATES.find((t) => t.id === templateId);
      if (tpl) html = tpl.html;
    }

    const site = {
      id: Math.random().toString(36).slice(2, 9),
      name: siteName,
      slug,
      status: "draft",
      source: templateSource,
      templateId,
      blocks,
      html,
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
              onSelect={handleSelectTemplate}
            />
          )}
          {step === 2 && (
            <BusinessTypePicker selected={businessType} onSelect={handleSelectBusinessType} />
          )}
          {step === 3 && (
            <BusinessInfo
              name={businessName}
              tagline={tagline}
              description={description}
              onChange={(field, val) => {
                if (field === "name") setBusinessName(val);
                else if (field === "tagline") setTagline(val);
                else setDescription(val);
              }}
            />
          )}
          {step === 4 && <ServicesEditor services={services} onChange={setServices} />}
          {step === 5 && <HoursEditor hours={hours} onChange={setHours} />}
          {step === 6 && (
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
    </div>
  );
}
