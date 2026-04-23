import Link from "next/link";
import { TEMPLATES } from "@/templates/registry";

export default function LandingPage() {
  return (
    <div className="min-h-dvh antialiased">

      {/* ─── Nav ─────────────────────────────────────── */}
      <header className="relative z-20 mx-auto flex h-[68px] max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="7" width="12" height="2" rx="1" fill="white" />
                <rect x="7" y="2" width="2" height="12" rx="1" fill="white" />
              </svg>
            </span>
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              LaunchSite <span className="font-normal text-slate-400">by Certxa</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "How it works", "Templates"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, "-")}`}
                className="text-[14px] font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[14px] font-medium text-slate-500 transition-colors hover:text-slate-900">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start building <span aria-hidden>→</span>
          </Link>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl overflow-visible px-8 pb-32 pt-10">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1.05fr]">

          {/* Left — copy */}
          <div className="relative z-10 pt-8">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[13px] font-medium text-slate-600 shadow-sm backdrop-blur-sm">
              <span className="text-blue-600 text-[11px]">✦</span>
              Website pages built for fast launches
            </div>

            <h1 className="text-[clamp(54px,7.5vw,88px)] font-black leading-[0.97] tracking-[-0.045em] text-slate-900">
              Launch a polished website page in minutes, not weeks.
            </h1>

            <p className="mt-7 max-w-[430px] text-[17px] leading-[1.68] text-slate-500">
              LaunchSite by Certxa helps salons, barbershops, nail studios, and service businesses get a stunning website live — without touching a line of code.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35"
              >
                Start building →
              </Link>
              <a href="#templates" className="text-[14px] font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-800">
                Browse templates
              </a>
            </div>
          </div>

          {/* Right — floating mockup composition */}
          <div className="relative hidden md:block" style={{ minHeight: 480 }}>

            {/* Floating "Ready to publish" popup — positioned outside/above the browser */}
            <div className="absolute left-[-10px] top-[52px] z-20 w-[220px] overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <div className="flex items-start gap-3 p-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L4.8 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13.5px] font-bold text-slate-900">Ready to publish</p>
                  <p className="text-[12px] text-slate-500">Desktop + mobile checked</p>
                </div>
              </div>
            </div>

            {/* Browser window — larger, bleeds right */}
            <div
              className="absolute right-[-80px] top-0 overflow-hidden rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.07)]"
              style={{ width: "calc(100% + 80px)" }}
            >
              {/* Chrome bar */}
              <div className="flex items-center gap-2 bg-[#1c1c1e] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 flex-1 rounded-md bg-[#2c2c2e] px-3 py-1 text-[11.5px] font-medium text-slate-400">
                  LaunchSite Studio · Certxa
                </span>
              </div>

              {/* App layout */}
              <div className="flex" style={{ minHeight: 390 }}>
                {/* Sidebar */}
                <div className="w-44 shrink-0 border-r border-slate-100 bg-white p-3">
                  <div className="rounded-xl bg-blue-600 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm">
                    Hero
                  </div>
                  {["Services", "Reviews", "Contact"].map((item) => (
                    <div key={item} className="px-3.5 py-2.5 text-[13px] text-slate-400">
                      {item}
                    </div>
                  ))}
                </div>

                {/* Mobile preview panel */}
                <div className="flex flex-1 flex-col justify-center bg-blue-600 p-10">
                  <div className="mx-auto w-full max-w-[240px]">
                    <div className="mb-3 h-1 w-16 rounded-full bg-white/25" />
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
                      Your business
                    </p>
                    <h2 className="text-[26px] font-black leading-[1.1] tracking-tight text-white">
                      Your business deserves a better first impression.
                    </h2>
                    <p className="mt-4 text-[13px] leading-relaxed text-blue-200">
                      Replace placeholder content with your real copy in seconds.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-3 text-[13px] font-semibold text-white">
                      Book now →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────── */}
      <section id="features" className="border-t border-black/[0.07] bg-white/30 py-24">
        <div className="mx-auto max-w-7xl px-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">Why LaunchSite</p>
          <h2 className="mb-14 text-[clamp(32px,3.5vw,50px)] font-black leading-[1.04] tracking-[-0.03em] text-slate-900">
            Skip the builder, get the site.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: "⚡", title: "Live in minutes", body: "Answer a short questionnaire and we configure and launch your site. No design decisions needed." },
              { icon: "🎨", title: "Industry-tuned designs", body: "Every template is crafted for a specific type of service business — salons, barbershops, studios, and more." },
              { icon: "🌐", title: "Your domain, sorted", body: "Point your existing domain or let us help you get one. We handle the DNS so you don't have to." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/[0.07] bg-white p-8 shadow-sm">
                <span className="mb-5 block text-3xl">{f.icon}</span>
                <h3 className="mb-2.5 text-[17px] font-black tracking-tight text-slate-900">{f.title}</h3>
                <p className="text-[14px] leading-[1.75] text-slate-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">How it works</p>
          <h2 className="mb-14 text-[clamp(32px,3.5vw,50px)] font-black leading-[1.04] tracking-[-0.03em] text-slate-900">
            Three steps, then you're live.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: "Pick a template", d: "Browse designs built for your type of business and choose the one that fits your brand." },
              { n: "02", t: "Fill in the details", d: "Tell us your business name, services, hours, and social links. Takes under 5 minutes." },
              { n: "03", t: "We launch it", d: "Your site goes live on a subdomain instantly. Connect your own domain whenever you're ready." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-black/[0.07] bg-white p-8 shadow-sm">
                <p className="mb-5 text-[56px] font-black leading-none tracking-[-0.04em] text-blue-600">{s.n}</p>
                <h3 className="mb-2.5 text-[17px] font-black tracking-tight text-slate-900">{s.t}</h3>
                <p className="text-[14px] leading-[1.75] text-slate-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Templates ───────────────────────────────── */}
      <section id="templates" className="border-t border-black/[0.07] bg-white/30 py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">Templates</p>
              <h2 className="text-[clamp(32px,3.5vw,50px)] font-black leading-[1.04] tracking-[-0.03em] text-slate-900">
                Find the right look<br className="hidden md:block" /> for your business.
              </h2>
              <p className="mt-4 max-w-[480px] text-[15px] leading-[1.7] text-slate-500">
                Pick a template, fill in your info, and get it live — your copy, your hours, your socials.
              </p>
            </div>
            <Link href="/signup" className="shrink-0 rounded-full bg-blue-600 px-7 py-3.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
              See all in the editor →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <Link
                key={t.slug}
                href="/signup"
                className="group block overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/[0.08]"
              >
                <div className={`relative flex h-52 items-end bg-gradient-to-br p-5 ${t.preview.bg}`}>
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    {t.preview.label}
                  </span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-[15px] font-bold tracking-tight text-slate-900">{t.name}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11.5px] font-semibold text-blue-700">
                      {t.category}
                    </span>
                  </div>
                  <span className="text-slate-300 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
            {["Restaurant", "Fitness studio", "Med spa", "Real estate"].map((name) => (
              <div key={name} className="overflow-hidden rounded-2xl border border-dashed border-black/[0.12] bg-white/40">
                <div className="flex h-52 items-center justify-center text-slate-200">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="p-5">
                  <p className="text-[15px] font-semibold text-slate-300">{name}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11.5px] font-semibold text-slate-400">
                    Coming soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────── */}
      <section className="py-32">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-[clamp(44px,6vw,72px)] font-black leading-[1.0] tracking-[-0.04em] text-slate-900">
            Ready to launch?
          </h2>
          <p className="mx-auto mt-6 max-w-[440px] text-[17px] leading-[1.7] text-slate-500">
            Get your business website live today. Free to start — bring your own domain whenever you're ready.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="rounded-full bg-blue-600 px-10 py-4 text-[16px] font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-xl">
              Start building for free →
            </Link>
            <Link href="/login" className="rounded-full border border-black/[0.12] bg-white px-10 py-4 text-[16px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="border-t border-black/[0.07] py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="7" width="12" height="2" rx="1" fill="white" />
                <rect x="7" y="2" width="2" height="12" rx="1" fill="white" />
              </svg>
            </span>
            <span className="text-[14px] font-bold text-slate-800">LaunchSite <span className="font-normal text-slate-400">by Certxa</span></span>
          </div>
          <p className="text-[13px] text-slate-400">© {new Date().getFullYear()} Certxa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
