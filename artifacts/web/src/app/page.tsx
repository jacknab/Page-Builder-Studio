import Link from "next/link";
import { TEMPLATES } from "@/templates/registry";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[#f0ebe1] text-slate-900" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4v12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="3" fill="white"/>
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight">
              LaunchSite <span className="font-normal text-slate-500">by Certxa</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Start building <span>→</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur">
              <span className="text-blue-600">✦</span>
              Website pages built for fast launches
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.03em] md:text-6xl lg:text-7xl">
              Launch a polished website page in minutes, not weeks.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-600 leading-relaxed">
              LaunchSite by Certxa helps salons, barbershops, nail studios, and service businesses get a stunning website live — without touching a line of code.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Start building →
              </Link>
              <a href="#templates" className="text-sm font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4">
                Browse templates
              </a>
            </div>
          </div>

          {/* App mockup */}
          <div className="relative hidden md:block">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400"/>
                <span className="h-3 w-3 rounded-full bg-yellow-400"/>
                <span className="h-3 w-3 rounded-full bg-green-400"/>
                <span className="ml-3 rounded bg-white px-3 py-1 text-xs font-medium text-slate-500 border border-slate-200">
                  LaunchSite Studio · Certxa
                </span>
              </div>
              <div className="flex" style={{ minHeight: 320 }}>
                {/* Sidebar */}
                <div className="w-44 border-r border-slate-100 bg-slate-50 p-3">
                  <div className="mb-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Hero</div>
                  {["Services", "Reviews", "Contact"].map((item) => (
                    <div key={item} className="px-3 py-2 text-sm text-slate-500">{item}</div>
                  ))}
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800">Ready to publish</p>
                        <p className="text-xs text-emerald-600">Desktop + mobile checked</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Preview */}
                <div className="flex-1 bg-blue-600 p-6 flex items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">Your business</p>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      Your business deserves a better first impression.
                    </h2>
                    <p className="mt-3 text-sm text-blue-200">Replace placeholder content with your real copy in seconds.</p>
                    <div className="mt-4 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white w-fit">
                      Book now →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-200/70 bg-white/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Why LaunchSite</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                Skip the builder, get the site.
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "⚡",
                title: "Live in minutes",
                desc: "Answer a quick questionnaire about your business and we configure and launch your site. No design decisions.",
              },
              {
                icon: "🎨",
                title: "Industry-tuned templates",
                desc: "Every template is built for a specific type of service business — salons, barbershops, studios, and more.",
              },
              {
                icon: "🌐",
                title: "Your domain, sorted",
                desc: "Point your existing domain or let us help you get one. We handle the DNS so you don't have to.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200/80 bg-white p-7">
                <div className="mb-4 text-3xl">{f.icon}</div>
                <h3 className="text-lg font-black">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">How it works</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              Three steps, then you're live.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Pick a template", d: "Browse designs built for your type of business and choose the one that fits." },
              { n: "02", t: "Fill in the details", d: "Tell us your business name, services, hours, and social links. Takes under 5 minutes." },
              { n: "03", t: "We launch it", d: "Your site goes live on a subdomain instantly. Connect your own domain whenever you're ready." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-200/80 bg-white p-7">
                <p className="mb-4 text-6xl font-black text-blue-600 leading-none">{s.n}</p>
                <h3 className="text-lg font-black">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-t border-slate-200/70 bg-white/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Templates</p>
              <h2 className="mt-2 max-w-xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Find the right look for your business.
              </h2>
              <p className="mt-3 max-w-lg text-slate-600">
                Preview the templates available in LaunchSite. Pick one you like and create an account to get it live with your business info.
              </p>
            </div>
            <Link
              href="/signup"
              className="shrink-0 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              See all in the editor →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <Link href="/signup" key={t.slug} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:shadow-slate-200 transition-all">
                <div className={`h-48 bg-gradient-to-br ${t.preview.bg} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white opacity-80">
                      <div className={`mx-auto mb-2 h-2 w-2 rounded-full ${t.preview.accent}`}/>
                      <p className="text-xs font-bold uppercase tracking-widest">{t.preview.label}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <div className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {t.category}
                    </div>
                  </div>
                  <span className="text-slate-400 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
            {/* Coming soon cards */}
            {["Restaurant", "Fitness studio", "Med spa", "Real estate"].map((name) => (
              <div key={name} className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white/50">
                <div className="flex h-48 items-center justify-center text-slate-300">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/></svg>
                </div>
                <div className="p-5">
                  <p className="font-bold text-slate-400">{name}</p>
                  <div className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                    Coming soon
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-black tracking-tight md:text-6xl">
            Ready to launch?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            Get your business website live today. Free to start — bring your own domain whenever you're ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-colors">
              Start building for free →
            </Link>
            <Link href="/login" className="rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4v12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="3" fill="white"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-700">LaunchSite <span className="font-normal text-slate-400">by Certxa</span></span>
          </div>
          <p>© {new Date().getFullYear()} Certxa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
