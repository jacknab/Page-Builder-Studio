import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { logout, getToken } from "@/lib/auth";
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
  Sliders,
  Globe,
  Link2,
  ShoppingCart,
  Copy,
  CheckCircle2,
  ArrowRight,
  Server,
} from "lucide-react";

import { BARBERSHOP2_THEMES, BARBERSHOP3_THEMES } from "@/lib/launchsiteTemplates";
import {
  type SiteContent,
  defaultNailSalonContent,
  defaultBarbershopContent,
  defaultBarbershop2Content,
} from "@/lib/siteContent";

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
type EditSection = "info" | "services" | "hours" | "contact" | "text" | null;

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
  text:     { title: "Page Text & Labels" },
};

// ─── Text / Content Form ──────────────────────────────────────────────────────
function TextField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 text-sm"
          rows={2}
          placeholder={placeholder}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 h-8 text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function TextForm({
  content,
  onChange,
  previewType,
}: {
  content: SiteContent;
  onChange: (c: SiteContent) => void;
  previewType: string;
}) {
  const upd = (field: keyof SiteContent, val: string) =>
    onChange({ ...content, [field]: val });
  const updReview = (idx: number, field: string, val: string) => {
    const reviews = content.reviews.map((r, i) =>
      i === idx ? { ...r, [field]: field === "rating" ? parseInt(val) : val } : r
    );
    onChange({ ...content, reviews });
  };
  const isNail = previewType === "nail-salon";
  const isBS = previewType === "barbershop" || previewType === "barbershop3";

  return (
    <div className="space-y-6">
      {/* Announcement */}
      {(isBS || previewType === "barbershop2") && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Announcement Bar</p>
          <TextField label="Announcement" value={content.announcement} onChange={(v) => upd("announcement", v)} placeholder="Walk-ins Welcome · Open Today" />
        </div>
      )}

      {/* Hero section */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Hero Section</p>
        <div className="space-y-3">
          <TextField label="Primary Button" value={content.heroCtaPrimary} onChange={(v) => upd("heroCtaPrimary", v)} />
          <TextField label="Secondary Button" value={content.heroCtaSecondary} onChange={(v) => upd("heroCtaSecondary", v)} />
          {!isNail && <TextField label="Badge" value={content.heroBadge} onChange={(v) => upd("heroBadge", v)} />}
          {isBS && <TextField label="Hint text" value={content.heroHint} onChange={(v) => upd("heroHint", v)} placeholder="e.g. ⚡ Join the queue online…" />}
          <TextField label="Trust badge 1" value={content.heroTrust1} onChange={(v) => upd("heroTrust1", v)} />
          <TextField label="Trust badge 2" value={content.heroTrust2} onChange={(v) => upd("heroTrust2", v)} />
          <TextField label="Trust badge 3" value={content.heroTrust3} onChange={(v) => upd("heroTrust3", v)} />
        </div>
      </div>

      {/* Navbar */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Navigation</p>
        <div className="space-y-3">
          <TextField label="CTA Button" value={content.navbarCta} onChange={(v) => upd("navbarCta", v)} />
          {isBS && <TextField label="Sub-label" value={content.navbarSubtitle} onChange={(v) => upd("navbarSubtitle", v)} placeholder="e.g. Barbershop" />}
        </div>
      </div>

      {/* Services section */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Services Section</p>
        <div className="space-y-3">
          <TextField label="Eyebrow" value={content.servicesEyebrow} onChange={(v) => upd("servicesEyebrow", v)} />
          <TextField label="Title" value={content.servicesTitle} onChange={(v) => upd("servicesTitle", v)} />
          <TextField label="Subtitle" value={content.servicesSubtitle} onChange={(v) => upd("servicesSubtitle", v)} />
          <TextField label="CTA Link" value={content.servicesCtaLabel} onChange={(v) => upd("servicesCtaLabel", v)} />
        </div>
      </div>

      {/* About section */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">About Section</p>
        <div className="space-y-3">
          <TextField label="Eyebrow" value={content.aboutEyebrow} onChange={(v) => upd("aboutEyebrow", v)} />
          <TextField label="Title" value={content.aboutTitle} onChange={(v) => upd("aboutTitle", v)} />
          <TextField label="Subtitle" value={content.aboutSubtitle} onChange={(v) => upd("aboutSubtitle", v)} multiline />
          <TextField label="Extra body paragraph" value={content.aboutBodyExtra} onChange={(v) => upd("aboutBodyExtra", v)} multiline />
        </div>
      </div>

      {/* Features (barbershop only) */}
      {(isBS || isNail) && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Feature Cards</p>
          <div className="space-y-3">
            <TextField label="Feature 1 title" value={content.feature1Title} onChange={(v) => upd("feature1Title", v)} />
            <TextField label="Feature 1 desc" value={content.feature1Desc} onChange={(v) => upd("feature1Desc", v)} multiline />
            <TextField label="Feature 2 title" value={content.feature2Title} onChange={(v) => upd("feature2Title", v)} />
            <TextField label="Feature 2 desc" value={content.feature2Desc} onChange={(v) => upd("feature2Desc", v)} multiline />
            <TextField label="Feature 3 title" value={content.feature3Title} onChange={(v) => upd("feature3Title", v)} />
            <TextField label="Feature 3 desc" value={content.feature3Desc} onChange={(v) => upd("feature3Desc", v)} multiline />
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Reviews</p>
        <div className="space-y-3">
          <TextField label="Eyebrow" value={content.reviewsEyebrow} onChange={(v) => upd("reviewsEyebrow", v)} />
          <TextField label="Title" value={content.reviewsTitle} onChange={(v) => upd("reviewsTitle", v)} />
          {content.reviews.map((r, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <p className="text-xs font-bold text-slate-400">Review {idx + 1}</p>
              <Input
                value={r.name}
                onChange={(e) => updReview(idx, "name", e.target.value)}
                className="h-7 text-xs bg-white"
                placeholder="Reviewer name"
              />
              <Textarea
                value={r.text}
                onChange={(e) => updReview(idx, "text", e.target.value)}
                className="text-xs bg-white"
                rows={2}
                placeholder="Review text"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Booking CTA */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Booking CTA Section</p>
        <div className="space-y-3">
          <TextField label="Title" value={content.bookingCtaTitle} onChange={(v) => upd("bookingCtaTitle", v)} />
          <TextField label="Subtitle" value={content.bookingCtaSubtitle} onChange={(v) => upd("bookingCtaSubtitle", v)} multiline />
          <TextField label="Button" value={content.bookingCtaLabel} onChange={(v) => upd("bookingCtaLabel", v)} />
        </div>
      </div>

      {/* Hours */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Hours Section</p>
        <div className="space-y-3">
          <TextField label="Eyebrow" value={content.hoursEyebrow} onChange={(v) => upd("hoursEyebrow", v)} />
          <TextField label="Title" value={content.hoursTitle} onChange={(v) => upd("hoursTitle", v)} />
        </div>
      </div>

      {/* Contact */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contact Section</p>
        <div className="space-y-3">
          <TextField label="Eyebrow" value={content.contactEyebrow} onChange={(v) => upd("contactEyebrow", v)} />
          <TextField label="Title" value={content.contactTitle} onChange={(v) => upd("contactTitle", v)} />
          <TextField label="Walk-ins text" value={content.contactWalkins} onChange={(v) => upd("contactWalkins", v)} />
        </div>
      </div>

      {/* Gallery / Team */}
      {isBS && (
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Gallery & Team</p>
          <div className="space-y-3">
            <TextField label="Gallery title" value={content.galleryTitle} onChange={(v) => upd("galleryTitle", v)} />
            <TextField label="Gallery subtitle" value={content.gallerySubtitle} onChange={(v) => upd("gallerySubtitle", v)} />
            <TextField label="Team title" value={content.teamTitle} onChange={(v) => upd("teamTitle", v)} />
            <TextField label="Team subtitle" value={content.teamSubtitle} onChange={(v) => upd("teamSubtitle", v)} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Publish Modal
// ─────────────────────────────────────────────────────────────────────────────

const VPS_IP = "YOUR_VPS_IP"; // Replace with actual server IP
const BASE_DOMAIN = "launchsite.certxa.com";
const PUBLISH_KEY = "launchsite-publish-v1";

type PublishOption = "subdomain" | "custom-domain" | "purchase";

interface PublishData {
  option: PublishOption;
  subdomain?: string;
  customDomain?: string;
  publishedAt?: string;
}

function toSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "my-business";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shrink-0"
    >
      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function PublishModal({
  businessName,
  sitePayload,
  onClose,
  onPublished,
}: {
  businessName: string;
  sitePayload: Record<string, unknown>;
  onClose: () => void;
  onPublished: (data: PublishData) => void;
}) {
  const [option, setOption] = useState<PublishOption>("subdomain");
  const [subdomain, setSubdomain] = useState(toSlug(businessName));
  const [customDomain, setCustomDomain] = useState("");
  const [launched, setLaunched] = useState(false);
  const [saving, setSaving] = useState(false);

  const subdomainUrl = `https://${subdomain}.${BASE_DOMAIN}`;
  const cleanDomain = customDomain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

  async function handleLaunch() {
    setSaving(true);
    const publishData: PublishData = {
      option,
      subdomain: option === "subdomain" ? subdomain : undefined,
      customDomain: option === "custom-domain" ? cleanDomain : undefined,
      publishedAt: new Date().toISOString(),
    };
    localStorage.setItem(PUBLISH_KEY, JSON.stringify(publishData));

    try {
      const token = getToken();
      await fetch("/api/sites/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...sitePayload,
          subdomain: option === "subdomain" ? subdomain : undefined,
          customDomain: option === "custom-domain" ? cleanDomain : undefined,
        }),
      });
    } catch {
      // still proceed — data saved locally
    }

    setSaving(false);
    setLaunched(true);
    onPublished(publishData);
  }

  const canLaunch =
    (option === "subdomain" && subdomain.length > 0) ||
    (option === "custom-domain" && cleanDomain.length > 0);

  const OPTIONS: { id: PublishOption; icon: React.ReactNode; label: string; desc: string; soon?: boolean }[] = [
    {
      id: "subdomain",
      icon: <Globe className="h-5 w-5" />,
      label: "Free subdomain",
      desc: `Get a free ${BASE_DOMAIN} address`,
    },
    {
      id: "custom-domain",
      icon: <Link2 className="h-5 w-5" />,
      label: "Use my domain",
      desc: "Connect a domain you already own",
    },
    {
      id: "purchase",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Buy a domain",
      desc: "Purchase a new domain name",
      soon: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative mx-4 w-full max-w-[520px] rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Rocket className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Launch your website</h2>
              <p className="text-xs text-slate-500">Choose how you want to publish it</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {launched ? (
          /* ── Success state ── */
          <div className="px-6 py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">You're live!</h3>
            {option === "subdomain" && (
              <>
                <p className="mt-2 text-sm text-slate-500">Your site is being published at:</p>
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="font-mono text-sm font-semibold text-blue-700">{subdomainUrl}</span>
                  <CopyButton text={subdomainUrl} />
                </div>
                <p className="mt-4 text-xs text-slate-400">It may take a few minutes to go live. We'll notify you when it's ready.</p>
              </>
            )}
            {option === "custom-domain" && (
              <>
                <p className="mt-2 text-sm text-slate-500">
                  Once your DNS record propagates, your site will be live at:
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="font-mono text-sm font-semibold text-blue-700">https://{cleanDomain}</span>
                  <CopyButton text={`https://${cleanDomain}`} />
                </div>
                <p className="mt-4 text-xs text-slate-400">DNS changes can take up to 24–48 hours to fully propagate.</p>
              </>
            )}
            <button
              onClick={onClose}
              className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Option cards ── */}
            <div className="grid grid-cols-3 gap-3 px-6 pt-5">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  disabled={opt.soon}
                  onClick={() => !opt.soon && setOption(opt.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition ${
                    opt.soon
                      ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50"
                      : option === opt.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {opt.soon && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Soon
                    </span>
                  )}
                  <span className={opt.soon ? "text-slate-400" : option === opt.id ? "text-blue-600" : "text-slate-500"}>
                    {opt.icon}
                  </span>
                  <span className={`text-xs font-bold ${opt.soon ? "text-slate-400" : option === opt.id ? "text-blue-700" : "text-slate-700"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] leading-tight text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>

            {/* ── Option content ── */}
            <div className="px-6 pb-6 pt-5">

              {/* Subdomain */}
              {option === "subdomain" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Your subdomain</Label>
                    <div className="mt-1.5 flex items-center gap-0 overflow-hidden rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                      <input
                        value={subdomain}
                        onChange={(e) => setSubdomain(toSlug(e.target.value) || e.target.value.toLowerCase())}
                        className="flex-1 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none"
                        placeholder="your-business"
                        spellCheck={false}
                      />
                      <span className="shrink-0 border-l border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400 font-medium">
                        .{BASE_DOMAIN}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                    <Globe className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="flex-1 truncate font-mono text-sm text-blue-700">{subdomainUrl}</span>
                    <CopyButton text={subdomainUrl} />
                  </div>
                  <p className="text-xs text-slate-400">
                    Free forever. You can connect a custom domain later at any time.
                  </p>
                </div>
              )}

              {/* Custom domain */}
              {option === "custom-domain" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Your domain name</Label>
                    <Input
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="mt-1.5"
                      placeholder="yourbusiness.com"
                      spellCheck={false}
                    />
                  </div>

                  {cleanDomain && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">DNS Setup Instructions</p>
                      <p className="text-xs text-slate-600">
                        Log in to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.) and add the following DNS record:
                      </p>

                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs">
                        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100 px-3 py-1.5 font-bold uppercase tracking-wider text-slate-500">
                          <span>Type</span>
                          <span>Host</span>
                          <span>Value</span>
                        </div>
                        <div className="grid grid-cols-3 items-center px-3 py-2.5 font-mono text-slate-800">
                          <span className="font-bold text-blue-700">A</span>
                          <span>@</span>
                          <div className="flex items-center gap-2">
                            <span className="truncate">{VPS_IP}</span>
                            <CopyButton text={VPS_IP} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        {[
                          { n: 1, text: "Log in to your domain registrar's control panel" },
                          { n: 2, text: 'Find "DNS Management" or "DNS Records" for your domain' },
                          { n: 3, text: 'Add an A record with Host "@" pointing to the IP above' },
                          { n: 4, text: "Save, then click Launch — DNS changes can take up to 48 hours" },
                        ].map(({ n, text }) => (
                          <div key={n} className="flex items-start gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                              {n}
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">{text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                        <Server className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                        <p className="text-[11px] text-amber-700">
                          <span className="font-bold">Server IP: </span>
                          <span className="font-mono">{VPS_IP}</span>
                        </p>
                        <CopyButton text={VPS_IP} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Launch button */}
              <button
                onClick={handleLaunch}
                disabled={!canLaunch || saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Rocket className="h-4 w-4" />
                {saving ? "Saving…" : option === "subdomain" ? "Launch with this subdomain" : "I've added the DNS record — Launch"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main dashboard component
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [saved, setSaved] = useState<OnboardingData | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [savedContent, setSavedContent] = useState<SiteContent | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishData, setPublishData] = useState<PublishData | null>(null);

  function getDefaultContent(d: OnboardingData): SiteContent {
    const pt = getPreviewType(d);
    if (pt === "nail-salon") return defaultNailSalonContent();
    if (pt === "barbershop2") return defaultBarbershop2Content();
    return defaultBarbershopContent();
  }

  useEffect(() => {
    const d = loadOnboarding();
    if (!d) { navigate("/onboarding"); return; }
    setData(d);
    setSaved(d);
    const c = d.siteContent ?? getDefaultContent(d);
    setContent(c);
    setSavedContent(c);
    const existing = localStorage.getItem(PUBLISH_KEY);
    if (existing) {
      try { setPublishData(JSON.parse(existing)); } catch { /* ignore */ }
    }
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

  if (!data || !content) return null;

  const previewType = getPreviewType(data);

  const handleSave = () => {
    if (!data || !content) return;
    saveOnboarding({ ...data, siteContent: content });
    setSaved({ ...data, siteContent: content });
    setSavedContent(content);
  };

  const handleDiscard = () => {
    setData(saved);
    setContent(savedContent);
  };

  const hasUnsaved =
    JSON.stringify(data) !== JSON.stringify(saved) ||
    JSON.stringify(content) !== JSON.stringify(savedContent);

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
          {publishData ? (
            <>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                Published
              </span>
              <a
                href={
                  publishData.option === "subdomain"
                    ? `https://${publishData.subdomain}.${BASE_DOMAIN}`
                    : `https://${publishData.customDomain}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate max-w-[200px] rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                <Globe className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {publishData.option === "subdomain"
                    ? `${publishData.subdomain}.${BASE_DOMAIN}`
                    : publishData.customDomain}
                </span>
              </a>
            </>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              Draft
            </span>
          )}
          {hasUnsaved && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const previewEl = document.getElementById("launchsite-preview");
              if (previewEl) {
                const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
                  .map((el) => el.outerHTML)
                  .join("\n");
                const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${data.businessName}</title>${styles}</head><body>${previewEl.innerHTML}</body></html>`;
                const EDITOR_KEY = "webpage-editor-sites-v2";
                try {
                  const existing = JSON.parse(localStorage.getItem(EDITOR_KEY) || "[]") as { id?: string; name?: string; slug?: string; status?: string; source?: string; html?: string; blocks?: unknown[]; [key: string]: unknown }[];
                  const base = existing[0] ?? { id: "launchsite-site", name: data.businessName, slug: data.businessName.toLowerCase().replace(/\s+/g, "-"), status: "draft" };
                  localStorage.setItem(EDITOR_KEY, JSON.stringify([{ ...base, source: "html", html, blocks: [] }]));
                } catch {
                  // proceed anyway
                }
              }
              window.location.href = "/app?edit";
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            title="Advanced editor — add photos, maps, new sections"
          >
            <Sliders className="h-4 w-4" />
            Advanced Editor
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <button
            onClick={() => setPublishOpen(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {publishData ? "Published ✓" : "Request Launch"}
          </button>
        </div>
      </header>

      {/* ── Body: preview (left) + editor panel (right) ─────────────────────── */}
      <div className="flex flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>

        {/* Left: template preview — scrolls with the page */}
        <div className="flex-1">
          <div id="launchsite-preview">
            {previewType === "nail-salon" && (() => {
              const theme = getNailTheme(data.templateId);
              const c = theme.colors;
              const cd = toNailData(data);
              return (
                <div style={{ backgroundColor: c.bg, color: c.text, fontFamily: theme.fonts.body }}>
                  <style>{`.ns-dash h1,.ns-dash h2,.ns-dash h3,.ns-dash h4,.ns-dash h5 { font-family: ${theme.fonts.heading}; }`}</style>
                  <div className="ns-dash">
                    <NailNavbar theme={theme} clientData={cd} content={content} />
                    <NailHero theme={theme} clientData={cd} content={content} />
                    <NailAbout theme={theme} clientData={cd} content={content} />
                    <NailServices theme={theme} clientData={cd} content={content} />
                    <NailHours theme={theme} clientData={cd} content={content} />
                    <NailContact theme={theme} clientData={cd} content={content} />
                    <NailFooter theme={theme} clientData={cd} content={content} />
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
                    <AnnouncementBar theme={theme} clientData={cd} content={content} />
                    <BsNavbar theme={theme} clientData={cd} content={content} />
                    <BsHero theme={theme} clientData={cd} content={content} />
                    <StatsBar theme={theme} clientData={cd} content={content} />
                    <WhyChoose theme={theme} clientData={cd} content={content} />
                    <BsServices theme={theme} clientData={cd} content={content} />
                    {cd.barbers && cd.barbers.length > 0 && (
                      <Barbers theme={theme} clientData={cd} content={content} />
                    )}
                    <BsLocation theme={theme} clientData={cd} content={content} />
                    <BsFooter theme={theme} clientData={cd} content={content} />
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
                    <Bs2Navbar theme={theme} clientData={cd} content={content} />
                    <Bs2Hero theme={theme} clientData={cd} content={content} />
                    <Bs2Services theme={theme} clientData={cd} content={content} />
                    <Bs2About theme={theme} clientData={cd} content={content} />
                    <Bs2Reviews theme={theme} clientData={cd} content={content} />
                    <BookingCTA theme={theme} clientData={cd} content={content} />
                    <Bs2Contact theme={theme} clientData={cd} content={content} />
                    <Bs2Footer theme={theme} clientData={cd} />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right: editor panel — flows alongside template, same height */}
        <div className="z-10 flex w-[360px] shrink-0 flex-col border-l border-slate-200 bg-white shadow-xl">

          {/* Panel header */}
          <div className="shrink-0 border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Site Editor</p>
            <p className="text-xs text-slate-400 mt-0.5">Changes update live in the preview</p>
          </div>

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>

            <div className="border-b border-slate-100 px-5 py-3 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Business Info</p>
            </div>
            <div className="px-5 py-4">
              <InfoForm data={data} onChange={setData} />
            </div>

            <div className="border-b border-t border-slate-100 px-5 py-3 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Services</p>
            </div>
            <div className="px-5 py-4">
              <ServicesForm data={data} onChange={setData} />
            </div>

            <div className="border-b border-t border-slate-100 px-5 py-3 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hours</p>
            </div>
            <div className="px-5 py-4">
              <HoursForm data={data} onChange={setData} />
            </div>

            <div className="border-b border-t border-slate-100 px-5 py-3 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact & Links</p>
            </div>
            <div className="px-5 py-4">
              <ContactForm data={data} onChange={setData} />
            </div>

            <div className="border-b border-t border-slate-100 px-5 py-3 bg-slate-50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Headings & Labels</p>
            </div>
            <div className="px-5 py-4">
              <TextForm content={content} onChange={setContent} previewType={previewType} />
            </div>

          </div>

          {/* Sticky footer */}
          <div className="shrink-0 border-t border-slate-100 p-4 flex gap-3">
            <button
              onClick={handleDiscard}
              disabled={!hasUnsaved}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsaved}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* ── Publish modal ─────────────────────────────────────────────────────── */}
      {publishOpen && (
        <PublishModal
          businessName={data.businessName || "My Business"}
          sitePayload={{
            templateId: data.templateId,
            businessType: data.businessType,
            businessName: data.businessName,
            tagline: data.tagline,
            description: data.description,
            phone: data.phone,
            email: data.email,
            address: data.address,
            established: data.estYear,
            teamSize: data.teamSize,
            bookingSlug: data.bookingSlug,
            bookingDomain: data.bookingDomain,
            services: data.services,
            hours: data.hours,
            googleUrl: data.googleUrl,
            instagramUrl: data.instagramUrl,
            facebookUrl: data.facebookUrl,
            tiktokUrl: data.tiktokUrl,
            yelpUrl: data.yelpUrl,
            siteContent: content,
          }}
          onClose={() => setPublishOpen(false)}
          onPublished={(pd) => {
            setPublishData(pd);
            setPublishOpen(false);
          }}
        />
      )}
    </div>
  );
}
