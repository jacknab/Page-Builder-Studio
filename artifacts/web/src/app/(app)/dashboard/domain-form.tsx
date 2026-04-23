"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DomainForm({ initial }: { initial: string }) {
  const router = useRouter();
  const [domain, setDomain] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/sites/me/domain", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customDomain: domain.trim() || null }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Failed to update domain");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="yourbusiness.com"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="sm:flex-1"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save domain"}
      </Button>
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      {success ? <p className="self-center text-sm font-bold text-emerald-600">Saved.</p> : null}
    </form>
  );
}
