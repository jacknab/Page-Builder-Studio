import { useLocation } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Globe2,
  LayoutTemplate,
  MapPin,
  Rocket,
  Share2,
  Sparkles,
  Tag,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";

const steps = [
  {
    icon: LayoutTemplate,
    title: "1. Pick a template",
    description:
      "Browse our curated collection of website templates designed for real local businesses. Choose the one that fits your brand — no design work required.",
  },
  {
    icon: ClipboardList,
    title: "2. Answer a few questions",
    description:
      "Walk through a guided onboarding form. Tell us about your business, services and prices, hours, Google listing, and social links. That's it.",
  },
  {
    icon: Rocket,
    title: "3. We launch your site",
    description:
      "We take your answers, drop them into your chosen template, and launch a finished website for you. No drag-and-drop. No editor to learn.",
  },
];

const onboardingItems = [
  { icon: Globe2, label: "About your business", hint: "Name, what you do, who you serve" },
  { icon: Tag, label: "Services & prices", hint: "What you offer and what you charge" },
  { icon: Clock, label: "Business hours", hint: "When customers can reach you" },
  { icon: MapPin, label: "Google listing URL", hint: "We pull in your reviews and map" },
  { icon: Share2, label: "Social media links", hint: "Instagram, Facebook, TikTok, more" },
];

const comparisons = [
  {
    not: "A drag-and-drop website builder",
    yes: "A done-for-you launch service",
  },
  {
    not: "Endless tools, plugins, and tutorials",
    yes: "A short questionnaire and a finished site",
  },
  {
    not: "Hours spent designing in an editor",
    yes: "Pick a template, answer questions, launch",
  },
];


export default function Landing() {
  const [, navigate] = useLocation();
  const loggedIn = isLoggedIn();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-950">
      <header className="relative z-20 border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Rocket className="h-6 w-6" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">LaunchSite</span>
          </button>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#how-it-works" className="hover:text-slate-950">How it works</a>
            <a href="#onboarding" className="hover:text-slate-950">What we ask</a>
            <button onClick={() => navigate("/templates")} className="hover:text-slate-950">Templates</button>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(loggedIn ? "/app" : "/login")}>
              {loggedIn ? "Open studio" : "Sign in"}
            </Button>
            <Button
              onClick={() => navigate(loggedIn ? "/app" : "/onboarding")}
              className="gap-2 bg-blue-600 font-bold hover:bg-blue-700"
            >
              Launch my site
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute right-0 top-32 h-[320px] w-[320px] rounded-full bg-amber-300/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Not a website builder. A launch service.
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
                Pick a template. Answer a few questions. We launch your site.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                LaunchSite isn't Wix, Squarespace, or another DIY editor. You don't drag, drop, or design.
                You choose a template, walk through a short onboarding questionnaire about your business,
                and we deliver a launched website built around your answers.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate(loggedIn ? "/app" : "/onboarding")}
                  className="h-14 gap-2 rounded-2xl bg-blue-600 px-7 text-base font-extrabold hover:bg-blue-700"
                >
                  Start my launch
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById("templates");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-14 rounded-2xl border-slate-300 bg-white/70 px-7 text-base font-bold"
                >
                  Browse templates
                </Button>
              </div>
              <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
                {["No editor to learn", "No design skills", "Launched for you"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 z-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">Site launched</p>
                    <p className="text-xs text-slate-500">From answers to live page</p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-slate-900/10">
                <div className="border-b border-slate-100 bg-slate-950 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                      Onboarding · Step 2 of 5
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Tell us about you</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">Your services & prices</h2>
                  <p className="mt-1 text-sm text-slate-500">List what you offer. We'll format it nicely on your site.</p>

                  <div className="mt-5 space-y-3">
                    {[
                      { name: "Gel Manicure", price: "$45" },
                      { name: "Acrylic Full Set", price: "$70" },
                      { name: "Pedicure Spa", price: "$55" },
                    ].map((row) => (
                      <div
                        key={row.name}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">{row.name}</p>
                          <p className="text-xs text-slate-500">Service</p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-extrabold text-blue-700">
                          {row.price}
                        </span>
                      </div>
                    ))}
                    <button className="w-full rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500">
                      + Add another service
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button className="text-sm font-bold text-slate-500">Back</button>
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
                LaunchSite vs. website builders
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                We're a launch service — not a tool you have to learn.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {comparisons.map((row) => (
                <div key={row.yes} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                    <p className="text-sm font-bold text-slate-500 line-through">{row.not}</p>
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <p className="text-sm font-extrabold text-slate-900">{row.yes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Three steps. No editor. No guesswork.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="onboarding" className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-300">
                  The onboarding questionnaire
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight">
                  Five quick sections. Then your site is launched.
                </h2>
                <p className="mt-4 text-base leading-7 text-white/70">
                  Once you choose a template, we walk you through a guided form. Fill it out at your own pace — your
                  answers populate every section of your new website.
                </p>
              </div>
              <div className="grid gap-3">
                {onboardingItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-extrabold">{item.label}</p>
                      <p className="text-sm text-white/60">{item.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-white md:p-14">
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-300">
                  Step one
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                  Start by choosing your template.
                </h2>
                <p className="mt-3 max-w-xl text-base text-white/70">
                  Browse our full library — organised by business type. Click any design you
                  like and we'll take you straight into setup.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate("/templates")}
                  className="h-14 gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-blue-700 hover:bg-blue-50"
                >
                  Browse templates
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
