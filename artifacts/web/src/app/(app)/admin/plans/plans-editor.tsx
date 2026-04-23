"use client";
import { useState } from "react";
import type { Plan } from "@workspace/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlansEditor({ initial }: { initial: Plan[] }) {
  const [plans, setPlans] = useState(initial);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function update(id: number, patch: Partial<Plan>) {
    setPlans((arr) => arr.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function save(plan: Plan) {
    setSavingId(plan.id);
    setMsg(null);
    const res = await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        priceCents: plan.priceCents,
        allowsCustomDomain: plan.allowsCustomDomain,
        allowsDomainPurchase: plan.allowsDomainPurchase,
        maxSites: plan.maxSites,
        sortOrder: plan.sortOrder,
      }),
    });
    setSavingId(null);
    if (res.ok) setMsg(`Saved "${plan.name}".`);
  }

  return (
    <div className="space-y-4">
      {plans.map((p) => (
        <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400">{p.slug}</p>
            <Button size="sm" onClick={() => save(p)} disabled={savingId === p.id}>
              {savingId === p.id ? "Saving…" : "Save"}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (cents)</Label>
              <Input
                type="number"
                value={p.priceCents}
                onChange={(e) => update(p.id, { priceCents: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Description</Label>
              <Input value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={p.allowsCustomDomain}
                onChange={(e) => update(p.id, { allowsCustomDomain: e.target.checked })}
              />
              Allows custom domain
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={p.allowsDomainPurchase}
                onChange={(e) => update(p.id, { allowsDomainPurchase: e.target.checked })}
              />
              Allows domain purchase
            </label>
          </div>
        </div>
      ))}
      {msg ? <p className="text-sm font-bold text-emerald-600">{msg}</p> : null}
    </div>
  );
}
