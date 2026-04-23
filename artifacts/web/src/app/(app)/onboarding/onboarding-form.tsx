"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@workspace/db/schema";
import { TEMPLATES } from "@/templates/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Mode = "create" | "edit";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function defaultHours() {
  return DAYS.map((day) => ({ day, open: "09:00", close: "17:00", closed: day === "Sun" }));
}

export function OnboardingForm({
  mode,
  initialContent,
  initialTemplate,
}: {
  mode: Mode;
  initialContent?: SiteContent;
  initialTemplate?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [templateSlug, setTemplateSlug] = useState(initialTemplate ?? TEMPLATES[0].slug);
  const [content, setContent] = useState<SiteContent>({
    business: { name: "", tagline: "", description: "", address: "", phone: "", email: "", ...initialContent?.business },
    services: initialContent?.services ?? [{ name: "", price: "", description: "" }],
    hours: initialContent?.hours ?? defaultHours(),
    googleListingUrl: initialContent?.googleListingUrl ?? "",
    social: { instagram: "", facebook: "", tiktok: "", twitter: "", youtube: "", ...initialContent?.social },
    brand: { primaryColor: "", accentColor: "", ...initialContent?.brand },
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ["Template", "Business", "Services", "Hours", "Links"];

  function setBusiness<K extends keyof NonNullable<SiteContent["business"]>>(k: K, v: string) {
    setContent((c) => ({ ...c, business: { ...c.business, [k]: v } }));
  }
  function setSocial<K extends keyof NonNullable<SiteContent["social"]>>(k: K, v: string) {
    setContent((c) => ({ ...c, social: { ...c.social, [k]: v } }));
  }
  function updateService(i: number, patch: Partial<NonNullable<SiteContent["services"]>[number]>) {
    setContent((c) => {
      const services = [...(c.services ?? [])];
      services[i] = { ...services[i], ...patch };
      return { ...c, services };
    });
  }
  function addService() {
    setContent((c) => ({ ...c, services: [...(c.services ?? []), { name: "", price: "", description: "" }] }));
  }
  function removeService(i: number) {
    setContent((c) => ({ ...c, services: (c.services ?? []).filter((_, j) => j !== i) }));
  }
  function updateHours(i: number, patch: Partial<NonNullable<SiteContent["hours"]>[number]>) {
    setContent((c) => {
      const hours = [...(c.hours ?? [])];
      hours[i] = { ...hours[i], ...patch };
      return { ...c, hours };
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleaned: SiteContent = {
      ...content,
      services: (content.services ?? []).filter((s) => s.name.trim().length > 0),
    };

    const url = mode === "create" ? "/api/sites/me" : "/api/sites/me";
    const method = mode === "create" ? "POST" : "PATCH";
    const body =
      mode === "create"
        ? JSON.stringify({ templateSlug, content: cleaned })
        : JSON.stringify(cleaned);

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data?.error ?? "Failed to save");
      return;
    }

    if (mode === "create" && initialTemplate !== templateSlug) {
      // Template already set on create
    }
    if (mode === "edit" && templateSlug !== initialTemplate) {
      await fetch("/api/sites/me/template", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug }),
      });
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <ol className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex-1 rounded-full px-3 py-2 text-center ${
              i === step ? "bg-blue-600 text-white" : i < step ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        {step === 0 ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black">Pick your template</h2>
              <p className="text-sm text-slate-600">You can change this later.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {TEMPLATES.map((t) => {
                const active = templateSlug === t.slug;
                return (
                  <button
                    type="button"
                    key={t.slug}
                    onClick={() => setTemplateSlug(t.slug)}
                    className={`rounded-2xl border-2 p-5 text-left transition ${
                      active ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className={`mb-3 h-24 rounded-lg bg-gradient-to-br ${t.preview.bg}`} />
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.category}</p>
                    <p className="mt-0.5 text-base font-black">{t.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{t.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Business information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Business name" required>
                <Input value={content.business?.name ?? ""} onChange={(e) => setBusiness("name", e.target.value)} required />
              </Field>
              <Field label="Tagline">
                <Input value={content.business?.tagline ?? ""} onChange={(e) => setBusiness("tagline", e.target.value)} />
              </Field>
              <Field label="Phone">
                <Input value={content.business?.phone ?? ""} onChange={(e) => setBusiness("phone", e.target.value)} />
              </Field>
              <Field label="Email">
                <Input type="email" value={content.business?.email ?? ""} onChange={(e) => setBusiness("email", e.target.value)} />
              </Field>
              <Field label="Address" className="md:col-span-2">
                <Input value={content.business?.address ?? ""} onChange={(e) => setBusiness("address", e.target.value)} />
              </Field>
              <Field label="Description" className="md:col-span-2">
                <Textarea
                  value={content.business?.description ?? ""}
                  onChange={(e) => setBusiness("description", e.target.value)}
                  rows={4}
                />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black">Services & prices</h2>
                <p className="text-sm text-slate-600">Add what you offer. Leave blank to skip.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addService}>
                + Add service
              </Button>
            </div>
            <div className="space-y-3">
              {(content.services ?? []).map((s, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
                    <Input placeholder="Service name" value={s.name} onChange={(e) => updateService(i, { name: e.target.value })} />
                    <Input placeholder="Price" value={s.price ?? ""} onChange={(e) => updateService(i, { price: e.target.value })} />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeService(i)}>
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    className="mt-3"
                    placeholder="Short description"
                    value={s.description ?? ""}
                    onChange={(e) => updateService(i, { description: e.target.value })}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Hours of operation</h2>
            <div className="space-y-2">
              {(content.hours ?? []).map((h, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <span className="w-12 text-sm font-bold">{h.day}</span>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={h.closed ?? false}
                      onChange={(e) => updateHours(i, { closed: e.target.checked })}
                    />
                    Closed
                  </label>
                  <Input
                    type="time"
                    value={h.open ?? ""}
                    disabled={h.closed}
                    onChange={(e) => updateHours(i, { open: e.target.value })}
                    className="w-32"
                  />
                  <span className="text-slate-400">–</span>
                  <Input
                    type="time"
                    value={h.close ?? ""}
                    disabled={h.closed}
                    onChange={(e) => updateHours(i, { close: e.target.value })}
                    className="w-32"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black">Google & social links</h2>
            <Field label="Google Business listing URL">
              <Input
                type="url"
                value={content.googleListingUrl ?? ""}
                onChange={(e) => setContent((c) => ({ ...c, googleListingUrl: e.target.value }))}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Instagram">
                <Input type="url" value={content.social?.instagram ?? ""} onChange={(e) => setSocial("instagram", e.target.value)} />
              </Field>
              <Field label="Facebook">
                <Input type="url" value={content.social?.facebook ?? ""} onChange={(e) => setSocial("facebook", e.target.value)} />
              </Field>
              <Field label="TikTok">
                <Input type="url" value={content.social?.tiktok ?? ""} onChange={(e) => setSocial("tiktok", e.target.value)} />
              </Field>
              <Field label="Twitter / X">
                <Input type="url" value={content.social?.twitter ?? ""} onChange={(e) => setSocial("twitter", e.target.value)} />
              </Field>
              <Field label="YouTube">
                <Input type="url" value={content.social?.youtube ?? ""} onChange={(e) => setSocial("youtube", e.target.value)} />
              </Field>
            </div>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          ← Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Next →
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? "Launching…" : mode === "create" ? "Launch my site" : "Save changes"}
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </Label>
      {children}
    </div>
  );
}
