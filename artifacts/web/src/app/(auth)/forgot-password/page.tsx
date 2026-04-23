"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; resetToken?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Request failed");
      return;
    }
    setResult(data);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
      <h1 className="text-3xl font-black tracking-tight">Reset password</h1>
      <p className="mt-1 text-sm text-slate-600">Enter your email to get a reset link.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      {result ? (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-bold">{result.message}</p>
          {result.resetToken ? (
            <p className="mt-2 break-all">
              Dev token:{" "}
              <Link href={`/reset-password?token=${result.resetToken}`} className="font-mono underline">
                {result.resetToken}
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="mt-6 text-sm">
        <Link href="/login" className="font-bold text-blue-600 hover:underline">
          ← Back to login
        </Link>
      </p>
    </div>
  );
}
