import { ArrowRight, CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout";

interface TemplateCard {
  name: string;
  businessType: string;
  emoji: string;
  style: string;
  styleColor: string;
  features: string[];
  gradient: string;
}

const templates: TemplateCard[] = [
  {
    name: "Luxe Nails",
    businessType: "Nail Salon",
    emoji: "💅",
    style: "Luxury",
    styleColor: "bg-purple-100 text-purple-700",
    features: ["Services menu with prices", "Gallery section", "Online booking button", "Google Maps embed"],
    gradient: "from-purple-600 to-pink-700",
  },
  {
    name: "Clean Cut Nails",
    businessType: "Nail Salon",
    emoji: "💅",
    style: "Minimal",
    styleColor: "bg-slate-100 text-slate-600",
    features: ["Simple services list", "Business hours", "Instagram feed link", "Contact section"],
    gradient: "from-slate-700 to-slate-900",
  },
  {
    name: "The Style Room",
    businessType: "Hair Salon",
    emoji: "✂️",
    style: "Modern",
    styleColor: "bg-blue-100 text-blue-700",
    features: ["Team profiles", "Services & pricing", "Before/after gallery", "Online booking"],
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    name: "Colour & Co.",
    businessType: "Hair Salon",
    emoji: "✂️",
    style: "Bold",
    styleColor: "bg-rose-100 text-rose-700",
    features: ["Colour services menu", "Stylist profiles", "Testimonials", "Social links"],
    gradient: "from-rose-500 to-orange-600",
  },
  {
    name: "QuickCuts",
    businessType: "Haircut Studio",
    emoji: "🪒",
    style: "Modern",
    styleColor: "bg-blue-100 text-blue-700",
    features: ["Walk-in pricing", "Locations & hours", "Wait time notice", "Google Maps"],
    gradient: "from-cyan-600 to-blue-700",
  },
  {
    name: "Fresh & Fast",
    businessType: "Haircut Studio",
    emoji: "🪒",
    style: "Minimal",
    styleColor: "bg-slate-100 text-slate-600",
    features: ["Simple price list", "What to expect section", "Hours & location", "Reviews"],
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    name: "The Classic Barber",
    businessType: "Barbershop",
    emoji: "💈",
    style: "Luxury",
    styleColor: "bg-purple-100 text-purple-700",
    features: ["Full service menu", "Barber profiles", "Appointment booking", "Walk-in policy"],
    gradient: "from-slate-800 to-slate-950",
  },
  {
    name: "Sharp & Co.",
    businessType: "Barbershop",
    emoji: "💈",
    style: "Bold",
    styleColor: "bg-rose-100 text-rose-700",
    features: ["Services & prices", "Photo gallery", "Google reviews", "Book online button"],
    gradient: "from-amber-600 to-orange-700",
  },
];

const businessTypeFilters = [
  { id: "all", label: "All templates" },
  { id: "Nail Salon", label: "💅 Nail Salons" },
  { id: "Hair Salon", label: "✂️ Hair Salons" },
  { id: "Haircut Studio", label: "🪒 Haircut Studios" },
  { id: "Barbershop", label: "💈 Barbershops" },
];

const included = [
  "Mobile-ready layout",
  "Your services & prices",
  "Business hours",
  "Google listing link",
  "Social media links",
  "Contact section",
];

export default function Templates() {
  return (
    <Layout currentPath="/templates">
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
            Step one: choose a template
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Professional templates for local service businesses.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Pick the design that fits your business. We'll fill it with your details — services,
            hours, links, and everything else — and launch it for you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="flex flex-wrap justify-center gap-2">
          {businessTypeFilters.map((f) => (
            <a
              key={f.id}
              href={f.id === "all" ? "/templates" : `/templates#${f.id.toLowerCase().replace(" ", "-")}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
            >
              {f.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <article
              key={template.name}
              id={template.businessType.toLowerCase().replace(" ", "-")}
              className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`flex h-44 items-center justify-center bg-gradient-to-br ${template.gradient} p-8 text-center text-white`}
              >
                <div>
                  <span className="text-5xl">{template.emoji}</span>
                  <p className="mt-3 text-xl font-black">{template.name}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="font-extrabold tracking-tight">{template.name}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${template.styleColor}`}
                  >
                    {template.style}
                  </span>
                </div>
                <p className="mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {template.businessType}
                </p>
                <ul className="space-y-1.5">
                  {template.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://164a3cac-ef64-450d-9bb9-d4905098b5ba-00-mr6ywxt9wxoc.kirk.replit.dev/signup"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-extrabold text-white transition hover:bg-blue-700"
                >
                  Use this template
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">
                Every template includes
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Everything your customers need to find, trust, and book you.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                We fill every template section with your real business information. No placeholder text left behind.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-center text-white md:p-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
            Found one you like?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Create an account, answer a few questions about your business, and we'll build the site around your chosen template.
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
