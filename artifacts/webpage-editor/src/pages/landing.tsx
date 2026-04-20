import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, Code2, Download, LayoutTemplate, MousePointer2, Palette, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { HTML_TEMPLATES } from "@/lib/htmlTemplates";
import { TEMPLATES } from "@/lib/templates";

type AiTemplate = {
  id: number;
  name: string;
  description: string;
  style: string;
  html: string;
};

const STYLE_BADGE: Record<string, string> = {
  luxury: "AI · Luxury",
  modern: "AI · Modern",
  minimal: "AI · Minimal",
  bold: "AI · Bold",
};

const features = [
  {
    icon: LayoutTemplate,
    title: "Start from ready-made pages",
    description: "Choose from polished templates for service businesses, startups, shops, and local brands.",
  },
  {
    icon: MousePointer2,
    title: "Edit without touching code",
    description: "Update headlines, sections, images, buttons, and embedded widgets from a simple visual editor.",
  },
  {
    icon: Download,
    title: "Export clean HTML",
    description: "Download a finished page you can host, hand to a developer, or continue refining.",
  },
];

const steps = [
  "Pick a template that fits your business",
  "Customize the copy, images, colors, and sections",
  "Preview on desktop and mobile, then export the final page",
];

const BASE_GALLERY = [
  ...TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    type: "Block template",
    html: null as string | null,
    imageUrl: String(template.blocks.find((block) => block.type === "hero" || block.type === "image")?.props.imageUrl ?? template.blocks.find((block) => block.type === "image")?.props.url ?? ""),
  })),
  ...HTML_TEMPLATES.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    type: "Full-page HTML",
    html: template.html as string | null,
    imageUrl: "",
  })),
];

export default function Landing() {
  const [, navigate] = useLocation();
  const loggedIn = isLoggedIn();
  const [aiTemplates, setAiTemplates] = useState<AiTemplate[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.templates)) setAiTemplates(data.templates);
      })
      .catch(() => {});
  }, []);

  const templateGallery = [
    ...BASE_GALLERY,
    ...aiTemplates.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.description,
      type: STYLE_BADGE[t.style] ?? "AI Template",
      html: t.html as string | null,
      imageUrl: "",
    })),
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-950">
      <header className="relative z-20 border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Wand2 className="h-6 w-6" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">LaunchSite</span>
          </button>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-950">Features</a>
            <a href="#how-it-works" className="hover:text-slate-950">How it works</a>
            <a href="#templates" className="hover:text-slate-950">Templates</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(loggedIn ? "/app" : "/login")}>
              {loggedIn ? "Open studio" : "Sign in"}
            </Button>
            <Button onClick={() => navigate(loggedIn ? "/app" : "/signup")} className="gap-2 bg-blue-600 font-bold hover:bg-blue-700">
              Start building
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
                Website pages built for fast launches
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
                Launch a polished website page in minutes, not weeks.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                LaunchSite helps small businesses and creators turn proven templates into custom landing pages with an easy editor, live previews, and clean HTML export.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => navigate(loggedIn ? "/app" : "/signup")} className="h-14 gap-2 rounded-2xl bg-blue-600 px-7 text-base font-extrabold hover:bg-blue-700">
                  Create your first page
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-14 rounded-2xl border-slate-300 bg-white/70 px-7 text-base font-bold">
                  Sign in to studio
                </Button>
              </div>
              <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
                {["No design skills needed", "Mobile preview included", "Export-ready HTML"].map((item) => (
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
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">Ready to publish</p>
                    <p className="text-xs text-slate-500">Desktop + mobile checked</p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-slate-900/10">
                <div className="border-b border-slate-100 bg-slate-950 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">LaunchSite Studio</span>
                  </div>
                </div>
                <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <aside className="hidden border-r border-slate-100 bg-slate-50 p-5 md:block">
                    <div className="mb-4 h-3 w-24 rounded-full bg-slate-200" />
                    <div className="space-y-3">
                      {["Hero", "Services", "Reviews", "Contact"].map((item, index) => (
                        <div key={item} className={`rounded-xl px-4 py-3 text-sm font-bold ${index === 0 ? "bg-blue-600 text-white" : "bg-white text-slate-500"}`}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </aside>
                  <div className="p-5">
                    <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-slate-950 p-8 text-white">
                      <div className="mb-12 h-3 w-28 rounded-full bg-white/30" />
                      <h2 className="max-w-sm text-4xl font-black leading-tight">Your business deserves a better first impression.</h2>
                      <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Replace placeholder content with your brand, offer, and proof in one focused workspace.</p>
                      <div className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-extrabold text-blue-700">Book a demo</div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      {[Palette, Code2, Download].map((Icon, index) => (
                        <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <Icon className="mb-5 h-5 w-5 text-blue-600" />
                          <div className="h-2 w-20 rounded-full bg-slate-200" />
                          <div className="mt-2 h-2 w-14 rounded-full bg-slate-200" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">What you get</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Everything needed to go from idea to page.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-300">Simple workflow</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight">Build the page, preview it, export it.</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-black">
                      {index + 1}
                    </div>
                    <p className="font-bold leading-7 text-white/90">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="templates" className="mx-auto max-w-7xl px-6 py-14 pb-24">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">Template gallery</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">Choose a starting point, then edit it for your business.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Preview the templates available in LaunchSite. Pick one you like and create an account to customize the copy, sections, and images.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate("/signup")} className="h-14 gap-2 rounded-2xl bg-blue-600 px-7 text-base font-extrabold hover:bg-blue-700">
              See all in the editor
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {templateGallery.map((template) => (
              <article
                key={template.id}
                onClick={() => navigate("/signup")}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-44 overflow-hidden bg-slate-100">
                  {template.html ? (
                    <iframe
                      title={`${template.name} preview`}
                      srcDoc={template.html}
                      className="h-[520px] w-full border-0 pointer-events-none"
                      style={{ transform: "scale(0.28)", transformOrigin: "top left", width: "358%" }}
                    />
                  ) : template.imageUrl ? (
                    <img src={template.imageUrl} alt={template.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 to-slate-950 p-8 text-center text-white">
                      <p className="text-2xl font-black">{template.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight text-slate-900 truncate">{template.name}</h3>
                    <span className="mt-1.5 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
                      {template.type}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}