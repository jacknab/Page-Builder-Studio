"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/templates/registry";
import { Button } from "@/components/ui/button";

export function TemplateSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState(current);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/sites/me/template", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateSlug: selected }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {TEMPLATES.map((t) => {
          const active = selected === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => setSelected(t.slug)}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                active ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className={`mb-3 h-20 rounded-lg bg-gradient-to-br ${t.preview.bg}`} />
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.category}</p>
              <p className="mt-0.5 text-base font-black">{t.name}</p>
              <p className="mt-1 text-xs text-slate-600">{t.description}</p>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      <Button onClick={save} disabled={loading || selected === current}>
        {loading ? "Saving…" : "Switch template"}
      </Button>
    </div>
  );
}
