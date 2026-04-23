"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Site } from "@workspace/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  site: Site;
  plans: Array<{ id: number; name: string; slug: string }>;
  templates: Array<{ slug: string; name: string }>;
};

export function AdminSiteForm({ site, plans, templates }: Props) {
  const router = useRouter();
  const [planId, setPlanId] = useState(site.planId);
  const [templateSlug, setTemplateSlug] = useState(site.templateSlug);
  const [customDomain, setCustomDomain] = useState(site.customDomain ?? "");
  const [status, setStatus] = useState(site.status);
  const [contentJson, setContentJson] = useState(JSON.stringify(site.content, null, 2));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    setMsg(null);
    let content;
    try {
      content = JSON.parse(contentJson);
    } catch {
      setError("Content JSON is invalid.");
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/admin/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId,
        templateSlug,
        customDomain: customDomain.trim() || null,
        status,
        content,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Save failed");
      return;
    }
    setMsg("Saved.");
    router.refresh();
  }

  async function destroy() {
    if (!confirm("Delete this site? This cannot be undone.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/sites/${site.id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Plan</Label>
          <select
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            value={planId}
            onChange={(e) => setPlanId(Number(e.target.value))}
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Template</Label>
          <select
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            value={templateSlug}
            onChange={(e) => setTemplateSlug(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Custom domain</Label>
          <Input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="example.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">draft</option>
            <option value="live">live</option>
            <option value="suspended">suspended</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Content (JSON)</Label>
        <Textarea
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          rows={18}
          className="font-mono text-xs"
        />
      </div>

      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      {msg ? <p className="text-sm font-bold text-emerald-600">{msg}</p> : null}

      <div className="flex justify-between">
        <Button variant="danger" onClick={destroy} disabled={loading}>
          Delete site
        </Button>
        <Button onClick={save} disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
