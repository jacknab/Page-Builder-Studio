import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { logout } from "@/lib/auth";
import {
  loadOnboarding,
  saveOnboarding,
  type OnboardingData,
  type BusinessHours,
  type ServiceItem,
} from "@/lib/onboardingData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  X,
  Rocket,
  Check,
  LogOut,
  Plus,
  Trash2,
  ChevronRight,
} from "lucide-react";

import { BARBERSHOP2_THEMES, BARBERSHOP3_THEMES } from "@/lib/launchsiteTemplates";

// ── Nail-salon section imports ────────────────────────────────────────────────
import { getThemeById as getNailTheme } from "@/components/preview/nail-salon/themes";
import type { ClientData as NailClientData } from "@/components/preview/nail-salon/types";
import {
  Navbar as NailNavbar,
  Hero as NailHero,
  About as NailAbout,
  Services as NailServices,
  Hours as NailHours,
  Contact as NailContact,
  Footer as NailFooter,
} from "@/components/preview/nail-salon/Sections";

// ── Barbershop (v1 + v3) section imports ─────────────────────────────────────
import { getThemeById as getBsTheme } from "@/components/preview/barbershop/themes";
import type { ClientData as BsClientData } from "@/components/preview/barbershop/types";
import {
  AnnouncementBar,
  Navbar as BsNavbar,
  Hero as BsHero,
  StatsBar,
  WhyChoose,
  Services as BsServices,
  Gallery,
  Barbers,
  Location as BsLocation,
  Footer as BsFooter,
} from "@/components/preview/barbershop/Sections";

// ── Barbershop v2 section imports ─────────────────────────────────────────────
import { getThemeById as getBs2Theme } from "@/components/preview/barbershop2/themes";
import type { ClientData as Bs2ClientData } from "@/components/preview/barbershop2/types";
import {
  Navbar as Bs2Navbar,
  Hero as Bs2Hero,
  Services as Bs2Services,
  About as Bs2About,
  Reviews as Bs2Reviews,
  BookingCTA,
  Contact as Bs2Contact,
  Footer as Bs2Footer,
} from "@/components/preview/barbershop2/Sections";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

type PreviewType = "nail-salon" | "barbershop" | "barbershop2" | "barbershop3";
type EditSection = "info" | "services" | "hours" | "contact" | null;

function formatTime(t: string): string {
  const [hr, min] = t.split(":").map(Number);
  const period = hr >= 12 ? "PM" : "AM";
  const h12 = hr % 12 || 12;
  return `${h12}:${min.toString().padStart(2, "0")} ${period}`;
}

function mapHours(hours: BusinessHours[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of hours) {
    out[h.day.toLowerCase()] = h.open
      ? `${formatTime(h.openTime)} – ${formatTime(h.closeTime)}`
      : "Closed";
  }
  return out;
}

function getPreviewType(data: OnboardingData): PreviewType {
  if (data.businessType === "nail-salon") return "nail-salon";
  if (BARBERSHOP2_THEMES.some((t) => t.id === data.templateId)) return "barbershop2";
  if (BARBERSHOP3_THEMES.some((t) => t.id === data.templateId)) return "barbershop3";
  return "barbershop";
}

function toNailData(d: OnboardingData): NailClientData {
  return {
    themeId: d.templateId,
    businessName: d.businessName || "My Nail Studio",
    tagline: d.tagline || "",
    description: d.description || "",
    phone: d.locations?.[0]?.phone || "",
    address: d.locations?.[0]?.address || "",
    established: d.established ?? undefined,
    teamSize: d.teamSize ?? undefined,
    services: d.services.map((s) => ({
      name: s.name,
      price: s.price,
      description: s.description,
      category: s.category,
    })),
    hours: mapHours(d.hours),
    googleUrl: d.googleListingUrl || undefined,
    instagramUrl: d.social.instagram || undefined,
    facebookUrl: d.social.facebook || undefined,
    yelpUrl: d.social.yelp || undefined,
  };
}

function toBsData(d: OnboardingData): BsClientData {
  return {
    themeId: d.templateId,
    businessName: d.businessName || "My Barbershop",
    tagline: d.tagline || "",
    description: d.description || "",
    phone: d.locations?.[0]?.phone || "",
    address: d.locations?.[0]?.address || "",
    established: d.established ?? undefined,
    numberOfBarbers: d.teamSize ?? undefined,
    bookingUrl: d.existingBookingUrl || undefined,
    services: d.services.map((s) => ({
      name: s.name,
      price: s.price,
      description: s.description,
    })),
    barbers: d.includeTeam
      ? d.teamMembers.map((m) => ({ name: m.name, role: "Barber", bio: m.bio, photoUrl: m.photoUrl }))
      : undefined,
    hours: mapHours(d.hours),
    googleUrl: d.googleListingUrl || undefined,
    instagramUrl: d.social.instagram || undefined,
    facebookUrl: d.social.facebook || undefined,
  };
}

function toBs2Data(d: OnboardingData): Bs2ClientData {
  return {
    themeId: d.templateId,
    businessName: d.businessName || "My Barbershop",
    tagline: d.tagline || "",
    description: d.description || "",
    phone: d.locations?.[0]?.phone || "",
    address: d.locations?.[0]?.address || "",
    established: d.established ?? undefined,
    bookingUrl: d.existingBookingUrl || undefined,
    services: d.services.map((s) => ({
      name: s.name,
      price: s.price,
      duration: s.duration,
      category: s.category,
    })),
    hours: mapHours(d.hours),
    googleUrl: d.googleListingUrl || undefined,
    instagramUrl: d.social.instagram || undefined,
    facebookUrl: d.social.facebook || undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EditableSection wrapper — shows blue ring + "Edit" button on hover
// ─────────────────────────────────────────────────────────────────────────────
function EditableSection({
  label,
  id,
  onEdit,
  children,
}: {
  label: string;
  id: EditSection;
  onEdit: (id: EditSection) => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-30"
            style={{ boxShadow: "inset 0 0 0 3px rgba(59,130,246,0.55)" }}
          />
          <div className="absolute right-4 top-4 z-40">
            <button
              onClick={() => onEdit(id)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Pencil className="h-3 w-3" />
              Edit {label}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit panel forms
// ─────────────────────────────────────────────────────────────────────────────

function InfoForm({ data, onChange }: { data: OnboardingData; onChange: (d: OnboardingData) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Business Name</Label>
        <Input
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Tagline</Label>
        <Input
          value={data.tagline}
          onChange={(e) => onChange({ ...data, tagline: e.target.value })}
          className="mt-1.5"
          placeholder="e.g. Where Every Cut Tells a Story"
        />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">About / Description</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1.5"
          rows={5}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Est. Year</Label>
          <Input
            type="number"
            value={data.established ?? ""}
            onChange={(e) =>
              onChange({ ...data, established: e.target.value ? parseInt(e.target.value) : null })
            }
            className="mt-1.5"
            placeholder="2015"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Team Size</Label>
          <Input
            type="number"
            value={data.teamSize ?? ""}
            onChange={(e) =>
              onChange({ ...data, teamSize: e.target.value ? parseInt(e.target.value) : null })
            }
            className="mt-1.5"
            placeholder="4"
          />
        </div>
      </div>
    </div>
  );
}

function ServicesForm({ data, onChange }: { data: OnboardingData; onChange: (d: OnboardingData) => void }) {
  const update = (idx: number, field: keyof ServiceItem, val: string) => {
    const updated = data.services.map((s, i) => (i === idx ? { ...s, [field]: val } : s));
    onChange({ ...data, services: updated });
  };
  const remove = (idx: number) =>
    onChange({ ...data, services: data.services.filter((_, i) => i !== idx) });
  const add = () =>
    onChange({
      ...data,
      services: [
        ...data.services,
        { id: Math.random().toString(36).slice(2, 9), name: "", price: "", description: "", duration: "", category: "" },
      ],
    });

  return (
    <div className="space-y-3">
      {data.services.map((svc, idx) => (
        <div key={svc.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Input
              value={svc.name}
              onChange={(e) => update(idx, "name", e.target.value)}
              placeholder="Service name"
              className="flex-1 h-8 text-sm bg-white"
            />
            <Input
              value={svc.price}
              onChange={(e) => update(idx, "price", e.target.value)}
              placeholder="Price"
              className="w-20 h-8 text-sm bg-white"
            />
            <button
              onClick={() => remove(idx)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Input
            value={svc.description ?? ""}
            onChange={(e) => update(idx, "description", e.target.value)}
            placeholder="Short description (optional)"
            className="mt-2 h-7 text-xs bg-white text-slate-500"
          />
        </div>
      ))}
      <button
        onClick={add}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition"
      >
        <Plus className="h-4 w-4" /> Add service
      </button>
    </div>
  );
}

function HoursForm({ data, onChange }: { data: OnboardingData; onChange: (d: OnboardingData) => void }) {
  const updateHour = (idx: number, field: keyof BusinessHours, val: string | boolean) => {
    const updated = data.hours.map((h, i) => (i === idx ? { ...h, [field]: val } : h));
    onChange({ ...data, hours: updated });
  };
  return (
    <div className="space-y-2">
      {data.hours.map((h, idx) => (
        <div key={h.day} className="flex items-center gap-2">
          <div className="w-24 text-sm font-semibold text-slate-700 shrink-0">{h.day.slice(0, 3)}</div>
          <button
            onClick={() => updateHour(idx, "open", !h.open)}
            className={`flex h-7 w-12 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
              h.open
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {h.open ? "Open" : "Off"}
          </button>
          {h.open ? (
            <div className="flex flex-1 items-center gap-1">
              <Input
                type="time"
                value={h.openTime}
                onChange={(e) => updateHour(idx, "openTime", e.target.value)}
                className="h-7 flex-1 text-xs px-1.5"
              />
              <span className="text-slate-400 text-xs shrink-0">–</span>
              <Input
                type="time"
                value={h.closeTime}
                onChange={(e) => updateHour(idx, "closeTime", e.target.value)}
                className="h-7 flex-1 text-xs px-1.5"
              />
            </div>
          ) : (
            <span className="flex-1 text-xs text-slate-400">Closed</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactForm({ data, onChange }: { data: OnboardingData; onChange: (d: OnboardingData) => void }) {
  const loc = data.locations?.[0] ?? { id: "1", name: "", address: "", phone: "" };
  const updateLoc = (field: string, val: string) => {
    const updated = data.locations.length
      ? data.locations.map((l, i) => (i === 0 ? { ...l, [field]: val } : l))
      : [{ ...loc, [field]: val }];
    onChange({ ...data, locations: updated });
  };
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Phone</Label>
        <Input
          value={loc.phone}
          onChange={(e) => updateLoc("phone", e.target.value)}
          className="mt-1.5"
          placeholder="(555) 000-0000"
        />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Address</Label>
        <Input
          value={loc.address}
          onChange={(e) => updateLoc("address", e.target.value)}
          className="mt-1.5"
          placeholder="123 Main St, City, ST 00000"
        />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Instagram URL</Label>
        <Input
          value={data.social.instagram}
          onChange={(e) => onChange({ ...data, social: { ...data.social, instagram: e.target.value } })}
          className="mt-1.5"
          placeholder="https://instagram.com/yourbusiness"
        />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Facebook URL</Label>
        <Input
          value={data.social.facebook}
          onChange={(e) => onChange({ ...data, social: { ...data.social, facebook: e.target.value } })}
          className="mt-1.5"
          placeholder="https://facebook.com/yourbusiness"
        />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Google Listing URL</Label>
        <Input
          value={data.googleListingUrl}
          onChange={(e) => onChange({ ...data, googleListingUrl: e.target.value })}
          className="mt-1.5"
          placeholder="https://g.page/..."
        />
      </div>
    </div>
  );
}

const PANEL_META: Record<Exclude<EditSection, null>, { title: string }> = {
  info:     { title: "Business Info" },
  services: { title: "Services & Prices" },
  hours:    { title: "Hours" },
  contact:  { title: "Contact & Social" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main dashboard component
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [saved, setSaved] = useState<OnboardingData | null>(null);
  const [activeSection, setActiveSection] = useState<EditSection>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = loadOnboarding();
    if (!d) { navigate("/onboarding"); return; }
    setData(d);
    setSaved(d);
  }, []);

  // Load Google Fonts for the active theme
  useEffect(() => {
    if (!data) return;
    const pt = getPreviewType(data);
    let theme: { fonts: { heading: string; body: string } } | null = null;
    try {
      if (pt === "nail-salon") theme = getNailTheme(data.templateId);
      else if (pt === "barbershop2") theme = getBs2Theme(data.templateId);
      else theme = getBsTheme(data.templateId);
    } catch { return; }
    const families = [
      theme.fonts.heading.split(",")[0].trim().replace(/'/g, ""),
      theme.fonts.body.split(",")[0].trim().replace(/'/g, ""),
    ];
    [...new Set(families)].forEach((font) => {
      const id = `gfont-dash-${font.replace(/ /g, "-")}`;
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    });
  }, [data?.templateId]);

  if (!data) return null;

  const previewType = getPreviewType(data);

  const handleEdit = (id: EditSection) => setActiveSection(id);

  const handleSave = () => {
    if (!data) return;
    saveOnboarding(data);
    setSaved(data);
    setActiveSection(null);
  };

  const handleDiscard = () => {
    setData(saved);
    setActiveSection(null);
  };

  const hasUnsaved = JSON.stringify(data) !== JSON.stringify(saved);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">

      {/* ── Chrome top bar ─────────────────────────────────────────────────── */}
      <header className="relative z-50 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Rocket className="h-4 w-4" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">LaunchSite</span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-sm font-semibold text-slate-700">{data.businessName || "My Business"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
            Draft
          </span>
          {hasUnsaved && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition">
            Request Launch
          </button>
        </div>
      </header>

      {/* ── Body: preview + panel ───────────────────────────────────────────── */}
      <div className="relative flex flex-1 overflow-hidden">

        {/* Scrollable preview area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="mx-auto w-full max-w-[1280px]">
            {previewType === "nail-salon" && (() => {
              const theme = getNailTheme(data.templateId);
              const c = theme.colors;
              const cd = toNailData(data);
              return (
                <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: theme.fonts.body }}>
                  <style>{`.ns-dash h1,.ns-dash h2,.ns-dash h3,.ns-dash h4,.ns-dash h5 { font-family: ${theme.fonts.heading}; }`}</style>
                  <div className="ns-dash">
                    <EditableSection label="Info" id="info" onEdit={handleEdit}>
                      <NailNavbar theme={theme} clientData={cd} />
                      <NailHero theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="About" id="info" onEdit={handleEdit}>
                      <NailAbout theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="Services" id="services" onEdit={handleEdit}>
                      <NailServices theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="Hours" id="hours" onEdit={handleEdit}>
                      <NailHours theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="Contact" id="contact" onEdit={handleEdit}>
                      <NailContact theme={theme} clientData={cd} />
                      <NailFooter theme={theme} clientData={cd} />
                    </EditableSection>
                  </div>
                </div>
              );
            })()}

            {(previewType === "barbershop" || previewType === "barbershop3") && (() => {
              const theme = getBsTheme(data.templateId);
              const c = theme.colors;
              const cd = toBsData(data);
              return (
                <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: theme.fonts.body }}>
                  <style>{`.bs-dash h1,.bs-dash h2,.bs-dash h3,.bs-dash h4,.bs-dash h5 { font-family: ${theme.fonts.heading}; }`}</style>
                  <div className="bs-dash">
                    <EditableSection label="Info" id="info" onEdit={handleEdit}>
                      <AnnouncementBar theme={theme} clientData={cd} />
                      <BsNavbar theme={theme} clientData={cd} />
                      <BsHero theme={theme} clientData={cd} />
                      <StatsBar theme={theme} clientData={cd} />
                      <WhyChoose theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="Services" id="services" onEdit={handleEdit}>
                      <BsServices theme={theme} clientData={cd} />
                    </EditableSection>
                    {cd.barbers && cd.barbers.length > 0 && (
                      <EditableSection label="Team" id="info" onEdit={handleEdit}>
                        <Barbers theme={theme} clientData={cd} />
                      </EditableSection>
                    )}
                    <EditableSection label="Hours & Location" id="contact" onEdit={handleEdit}>
                      <BsLocation theme={theme} clientData={cd} />
                    </EditableSection>
                    <BsFooter theme={theme} clientData={cd} />
                  </div>
                </div>
              );
            })()}

            {previewType === "barbershop2" && (() => {
              const theme = getBs2Theme(data.templateId);
              const c = theme.colors;
              const cd = toBs2Data(data);
              return (
                <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: theme.fonts.body }}>
                  <style>{`.bs2-dash h1,.bs2-dash h2,.bs2-dash h3,.bs2-dash h4 { font-family: ${theme.fonts.heading}; }`}</style>
                  <div className="bs2-dash">
                    <EditableSection label="Info" id="info" onEdit={handleEdit}>
                      <Bs2Navbar theme={theme} clientData={cd} />
                      <Bs2Hero theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="Services" id="services" onEdit={handleEdit}>
                      <Bs2Services theme={theme} clientData={cd} />
                    </EditableSection>
                    <EditableSection label="About" id="info" onEdit={handleEdit}>
                      <Bs2About theme={theme} clientData={cd} />
                    </EditableSection>
                    <Bs2Reviews theme={theme} clientData={cd} />
                    <EditableSection label="Contact" id="contact" onEdit={handleEdit}>
                      <BookingCTA theme={theme} clientData={cd} />
                      <Bs2Contact theme={theme} clientData={cd} />
                    </EditableSection>
                    <Bs2Footer theme={theme} clientData={cd} />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── Right edit panel ──────────────────────────────────────────────── */}
        <div
          ref={panelRef}
          className={`absolute right-0 top-0 flex h-full w-[380px] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            activeSection ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {activeSection && (
            <>
              {/* Panel header */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-base font-extrabold text-slate-900">
                  {PANEL_META[activeSection].title}
                </h2>
                <button
                  onClick={handleDiscard}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {activeSection === "info"     && <InfoForm     data={data} onChange={setData} />}
                {activeSection === "services" && <ServicesForm data={data} onChange={setData} />}
                {activeSection === "hours"    && <HoursForm    data={data} onChange={setData} />}
                {activeSection === "contact"  && <ContactForm  data={data} onChange={setData} />}
              </div>

              {/* Panel footer */}
              <div className="shrink-0 border-t border-slate-100 p-4 flex gap-3">
                <button
                  onClick={handleDiscard}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
                >
                  <Check className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
