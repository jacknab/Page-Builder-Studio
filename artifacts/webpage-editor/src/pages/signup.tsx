import { useState } from "react";
import { useLocation } from "wouter";
import { signup } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader, SiteFooter } from "@/components/SiteLayout";

export default function Signup() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const result = await signup(email, password);

    if (result.success) {
      navigate("/onboarding");
    } else {
      setError(result.error ?? "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1e8]">
      <SiteHeader hideCta="signup" />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">Then we'll walk you through getting your site set up.</p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="h-11"
                />
              </div>

              <div>
                <Label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div>
                <Label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Confirm password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-blue-600 text-base font-bold hover:bg-blue-700"
              >
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
