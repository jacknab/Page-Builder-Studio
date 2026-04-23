import { useState } from "react";
import { useLocation } from "wouter";
import { forgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, ArrowLeft, Copy, Check } from "lucide-react";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    if (result.resetToken) {
      setResetToken(result.resetToken);
    }
  };

  const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <Wand2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your email and we'll generate a reset link</p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          {!resetToken ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email address
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
                {loading ? "Generating link…" : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-800">
                <p className="font-semibold mb-1">Reset link generated</p>
                <p className="text-xs text-green-700">
                  Since email sending is not yet configured, copy the link below to reset your password. It expires in 1 hour.
                </p>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Your reset link
                </Label>
                <div className="flex gap-2">
                  <code className="flex-1 overflow-x-auto rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700 whitespace-nowrap">
                    {resetUrl}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                className="h-11 w-full bg-blue-600 text-base font-bold hover:bg-blue-700"
              >
                Go to reset page
              </Button>
            </div>
          )}

          <button
            onClick={() => navigate("/login")}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
