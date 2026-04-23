import {
  ArrowRight,
  Clock,
  Globe2,
  LayoutTemplate,
  MapPin,
  Rocket,
  Share2,
  Tag,
  HelpCircle,
  ClipboardList,
} from "lucide-react";
import Layout from "../components/Layout";

const onboardingSteps = [
  {
    num: "01",
    icon: LayoutTemplate,
    title: "Pick a template",
    description:
      "Browse our curated library of website templates built for nail salons, hair salons, haircut studios, and barbershops. Each template is professionally designed and mobile-ready. Click the one that fits your brand — that's step one done.",
    detail: "Templates are pre-built for your industry. You don't customise the design — we do that for you.",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Choose your business type",
    description:
      "Tell us whether you're a nail salon, hair salon, haircut studio, or barbershop. Based on your answer, we pre-populate your services list with common offerings for your business type — no starting from scratch.",
    detail: "Your services list is fully editable. Add, remove, or change any item. We just give you a smart head start.",
  },
  {
    num: "03",
    icon: Globe2,
    title: "About your business",
    description:
      "Enter your business name, a short tagline, and a brief description. This content fills your site's hero section and about section — so visitors immediately understand who you are and what you do.",
    detail: "Keep it simple. Even just a name and tagline is enough to get started.",
  },
  {
    num: "04",
    icon: Tag,
    title: "Services & prices",
    description:
      'Review the pre-filled services for your business type. Edit names, add prices (or leave them blank), remove services you don\'t offer, and add anything we missed. Prices are flexible — you can type "$45", "$30–$50", or "Call for details".',
    detail: "If you'd rather not display prices, just leave the price field blank and it won't appear on your site.",
  },
  {
    num: "05",
    icon: Clock,
    title: "Business hours",
    description:
      "Set your opening and closing times for each day of the week. Toggle days open or closed with a single click. Your hours are automatically formatted and placed in the right section of your website.",
    detail: "Changed your hours later? Just get in touch and we'll update them.",
  },
  {
    num: "06",
    icon: MapPin,
    title: "Google listing & social links",
    description:
      "Paste your Google Business listing URL, Instagram, Facebook, TikTok, or Yelp links. We embed them directly in your site so customers can find your reviews, follow you, and get directions without hunting for your details.",
    detail: "All fields are optional. We only include what you provide.",
  },
];

const faqs = [
  {
    q: "Do I need any design or coding skills?",
    a: "None at all. You answer questions in plain language — we handle the design, layout, and code. The most technical thing you'll do is paste a URL.",
  },
  {
    q: "How long does it take?",
    a: "The questionnaire takes around 10 minutes to complete. Your finished website is ready shortly after.",
  },
  {
    q: "Can I change things after my site is launched?",
    a: "Yes. Contact us with any updates to your services, hours, or content and we'll make the changes for you.",
  },
  {
    q: "What if none of the templates fit my business?",
    a: "We're always adding new templates. Let us know what you're looking for and we can find or build the right fit.",
  },
  {
    q: "Do I need hosting?",
    a: "We handle hosting as part of the service. Your site is live on a proper domain — no technical setup on your end.",
  },
];

export default function HowItWorks() {
  return (
    <Layout currentPath="/how-it-works">
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">How it works</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Three steps. No editor. No guesswork.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            You pick a template and answer a short questionnaire. We turn your
            answers into a complete, launched website. Here's exactly what happens.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-4">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { label: "Pick template", icon: LayoutTemplate, color: "bg-blue-50 text-blue-600" },
            { label: "Answer questions", icon: ClipboardList, color: "bg-purple-50 text-purple-600" },
            { label: "Site launched", icon: Rocket, color: "bg-green-50 text-green-600" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">Step {i + 1}</p>
                <p className="font-extrabold">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">The questionnaire</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Six sections. Around 10 minutes.
          </h2>
          <p className="mt-3 text-base text-slate-500">
            After you choose a template, we walk you through these sections one at a time.
          </p>
        </div>

        <div className="space-y-5">
          {onboardingSteps.map((step) => (
            <div
              key={step.num}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-start gap-5 p-6 md:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">
                      Section {step.num}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-extrabold tracking-tight">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                    💡 {step.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">FAQ</p>
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Common questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900">{faq.q}</h3>
              <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-slate-950 p-10 text-center text-white md:p-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
            Pick a template, answer the questionnaire, and your site is live.
          </p>
          <a
            href="/templates"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-blue-700 transition hover:bg-blue-50"
          >
            Browse templates
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </Layout>
  );
}
