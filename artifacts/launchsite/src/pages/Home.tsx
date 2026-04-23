import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LayoutTemplate,
  Rocket,
  Sparkles,
  XCircle,
} from "lucide-react";
import Layout from "../components/Layout";

const businessTypes = [
  { emoji: "💅", label: "Nail Salon" },
  { emoji: "✂️", label: "Hair Salon" },
  { emoji: "🪒", label: "Haircut Studio" },
  { emoji: "💈", label: "Barbershop" },
];

const steps = [
  {
    num: "01",
    icon: LayoutTemplate,
    title: "Pick a template",
    body: "Browse our library of professional templates designed for local service businesses. Click the one that fits your brand.",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Answer a few questions",
    body: "Walk through a guided questionnaire: your business name, services & prices, hours, Google listing, and social links.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "We launch your site",
    body: "We take your answers, fill them into your chosen template, and deliver a complete, live website — ready to share.",
  },
];

const comparisons = [
  {
    not: "A drag-and-drop website builder to learn",
    yes: "A done-for-you website launch service",
  },
  {
    not: "Hours spent designing pages and picking fonts",
    yes: "A short questionnaire — then we're done",
  },
  {
    not: "Plugins, monthly fees, and update headaches",
    yes: "One clean website, built around your business",
  },
];

const trustItems = [
  "No design skills needed",
  "No editor to learn",
  "Mobile-ready out of the box",
  "Launched for you",
];

export default function Home() {
  return (
    <Layout currentPath="/">
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />
        <div className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center lg:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Not a website builder — a launch service
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1] tracking-tight text-slate-950 md:text-7xl">
            Your business website,{" "}
            <span className="text-blue-600">done&nbsp;for&nbsp;you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Pick a template, answer a few questions about your business, and we
            launch your website. No editor. No design skills. No learning curve.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://164a3cac-ef64-450d-9bb9-d4905098b5ba-00-mr6ywxt9wxoc.kirk.replit.dev/signup"
              className="inline-flex h-14 items-center gap-2 rounded-2xl bg-blue-600 px-8 text-base font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Start my launch
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/templates"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border border-slate-300 bg-white/70 px-8 text-base font-bold text-slate-700 transition hover:bg-white"
            >
              Browse templates
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
              Launchsite vs. website builders
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              We're a service, not a tool.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
              You shouldn't need to become a web designer to have a great website.
              We handle everything — you just answer a few questions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {comparisons.map((row) => (
              <div key={row.yes} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                  <p className="text-sm text-slate-400 line-through">{row.not}</p>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <p className="text-sm font-extrabold text-slate-900">{row.yes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">How it works</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Three steps. That's it.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="absolute right-6 top-6 text-6xl font-black text-slate-100 select-none">
                {step.num}
              </div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 hover:underline">
            See the full process
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">Who it's built for</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Templates for local service businesses.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            We specialise in beauty and grooming businesses. Pick your type and we've already pre-filled your services.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {businessTypes.map((bt) => (
            <a
              key={bt.label}
              href="/templates"
              className="group flex flex-col items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <span className="text-5xl">{bt.emoji}</span>
              <h3 className="text-lg font-extrabold">{bt.label}</h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                View templates <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-center text-white md:p-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
            Ready to skip the editor and just get your site live?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Pick a template, answer the questionnaire, and we'll do the rest.
          </p>
          <a
            href="https://164a3cac-ef64-450d-9bb9-d4905098b5ba-00-mr6ywxt9wxoc.kirk.replit.dev/signup"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-blue-700 transition hover:bg-blue-50"
          >
            Start my launch
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </Layout>
  );
}
