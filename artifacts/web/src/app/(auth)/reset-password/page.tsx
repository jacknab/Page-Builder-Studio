"use client";
import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialToken = params.get("token") ?? "";
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Reset failed");
      return;
    }
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="token">Reset token</Label>
        <Input id="token" required value={token} onChange={(e) => setToken(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
      <h1 className="text-3xl font-black tracking-tight">Set a new password</h1>
      <p className="mt-1 text-sm text-slate-600">Paste your reset token below.</p>
      <Suspense fallback={<p className="mt-6 text-sm text-slate-500">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
      <p className="mt-6 text-sm">
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          ← Back to login
        </Link>
      </p>
    </div>
  );
}
