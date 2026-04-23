import { useLocation } from "wouter";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { BARBERSHOP_THEMES } from "@/lib/launchsiteTemplates";

type Category = {
  id: string;
  label: string;
  emoji: string;
  templates: typeof BARBERSHOP_THEMES | null;
};

const CATEGORIES: Category[] = [
  { id: "barbershop",     label: "Barbershop",     emoji: "💈", templates: BARBERSHOP_THEMES },
  { id: "nail-salon",     label: "Nail Salon",      emoji: "💅", templates: null },
  { id: "hair-salon",     label: "Hair Salon",      emoji: "✂️", templates: null },
  { id: "haircut-studio", label: "Haircut Studio",  emoji: "🪒", templates: null },
];

export default function TemplatesPage() {
  const [, navigate] = useLocation();
  const loggedIn = isLoggedIn();

  const handleSelect = () => {
    navigate(loggedIn ? "/onboarding" : "/signup");
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Rocket className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">LaunchSite</span>
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(loggedIn ? "/app" : "/login")}
              className="font-semibold"
            >
              {loggedIn ? "Open studio" : "Sign in"}
            </Button>
            <Button
              onClick={handleSelect}
              className="gap-2 bg-blue-600 font-bold hover:bg-blue-700"
            >
              Start my launch
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Page heading */}
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
            Step one
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Browse our templates.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Find the design that fits your business. Click any template to get started — we'll
            walk you through the rest.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {CATEGORIES.map((cat) => (
            <section key={cat.id}>
              {/* Category header */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{cat.label}</h2>
                  {cat.templates ? (
                    <p className="text-sm text-slate-500">
                      {cat.templates.length} templates available
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-amber-600">Coming soon</p>
                  )}
                </div>
              </div>

              {/* Templates grid or coming soon */}
              {cat.templates ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cat.templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={handleSelect}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={tpl.heroImage}
                          alt={tpl.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          style={{ filter: "brightness(0.8)" }}
                        />
                        <div
                          className="absolute inset-0 opacity-35"
                          style={{
                            background: `linear-gradient(135deg, ${tpl.bgColor} 0%, transparent 60%)`,
                          }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1"
                          style={{ background: tpl.accentColor }}
                        />
                        <span
                          className="absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow"
                          style={{ background: tpl.accentColor, color: "#fff" }}
                        >
                          {tpl.style}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-extrabold tracking-tight">{tpl.name}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{tpl.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-8 py-10">
                  <span className="text-5xl opacity-20">{cat.emoji}</span>
                  <div>
                    <p className="text-lg font-black text-slate-300">Coming Soon</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {cat.label} templates are being designed. Check back soon.
                    </p>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-center text-white md:p-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
            Found one you like?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Create an account, answer a few questions about your business, and we'll build and
            launch your site.
          </p>
          <Button
            size="lg"
            onClick={handleSelect}
            className="mt-8 h-14 gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-blue-700 hover:bg-blue-50"
          >
            Start my launch
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
