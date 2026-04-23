import { useLocation } from "wouter";
import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";

export function SiteHeader({ hideCta }: { hideCta?: "login" | "signup" }) {
  const [, navigate] = useLocation();
  const loggedIn = isLoggedIn();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Rocket className="h-6 w-6" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-950">LaunchSite</span>
        </button>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <button onClick={() => navigate("/templates")} className="hover:text-slate-950">
            Templates
          </button>
          <a href="/#how-it-works" className="hover:text-slate-950">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {hideCta !== "login" && (
            <Button variant="ghost" onClick={() => navigate(loggedIn ? "/app" : "/login")}>
              {loggedIn ? "Open studio" : "Sign in"}
            </Button>
          )}
          {hideCta !== "signup" && (
            <Button
              onClick={() => navigate(loggedIn ? "/app" : "/onboarding")}
              className="gap-2 bg-blue-600 font-bold hover:bg-blue-700"
            >
              {loggedIn ? "Open studio" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const [, navigate] = useLocation();

  return (
    <footer className="border-t border-slate-200 bg-[#f5f1e8]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="font-bold text-slate-800">LaunchSite</span>
        </button>
        <p>© {new Date().getFullYear()} LaunchSite. Done-for-you websites for local businesses.</p>
        <div className="flex gap-5">
          <button onClick={() => navigate("/templates")} className="hover:text-slate-900">
            Templates
          </button>
          <button onClick={() => navigate("/login")} className="hover:text-slate-900">
            Sign in
          </button>
        </div>
      </div>
    </footer>
  );
}
