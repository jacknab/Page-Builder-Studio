import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [location, navigate] = useLocation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    if (!token) {
      setError("No reset token found. Please request a new reset link.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setDone(true);
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <Wand2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {done ? "Password updated" : "Set new password"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {done ? "Your password has been changed successfully." : "Choose a strong new password"}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          {done ? (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-sm text-slate-600">
                You can now sign in with your new password.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="h-11 w-full bg-blue-600 text-base font-bold hover:bg-blue-700"
              >
                Sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!token && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
                  No reset token detected. Please use the link from your reset email.
                </div>
              )}

              <div>
                <Label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="h-11"
                />
              </div>

              <div>
                <Label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Confirm new password
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
                disabled={loading || !token}
                className="h-11 w-full bg-blue-600 text-base font-bold hover:bg-blue-700"
              >
                {loading ? "Saving…" : "Update password"}
              </Button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="block w-full text-center text-sm text-slate-400 hover:text-slate-700"
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
