import Link from "next/link";
import { TEMPLATES } from "@/templates/registry";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-black tracking-tight">
            LaunchSite
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get launched</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700">
            Done-for-you website launch
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            We launch your site.
            <br />
            <span className="text-blue-600">You run your business.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Pick a template, answer a few questions, and your site goes live. No drag-and-drop. No
            "design skills" required. Just a launched website pointed at your domain.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/signup">
              <Button size="lg">Start onboarding →</Button>
            </Link>
            <Link href="#templates">
              <Button size="lg" variant="outline">See templates</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-xs font-extrabold uppercase tracking-[0.3em] text-blue-600">
            DIY builders vs. LaunchSite
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-3xl font-black tracking-tight">
            You shouldn't have to learn web design to have a website.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Wix · Squarespace</p>
              <h3 className="mt-2 text-2xl font-black">DIY builders</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Hours of dragging blocks around</li>
                <li>• You're stuck designing it yourself</li>
                <li>• 90% of trials never go live</li>
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-xl shadow-blue-100">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">LaunchSite</p>
              <h3 className="mt-2 text-2xl font-black">Done-for-you launches</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Pick a template designed for your industry</li>
                <li>• Answer a 5-minute questionnaire</li>
                <li>• Your site is live — pointed at your domain</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-xs font-extrabold uppercase tracking-[0.3em] text-blue-600">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-3xl font-black tracking-tight">
            Three steps from sign-up to live.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Pick a template", d: "Browse industry-tuned templates and pick the one that fits." },
              { n: "02", t: "Tell us about you", d: "Business info, services & prices, hours, social links." },
              { n: "03", t: "We launch it", d: "Your site goes live on a subdomain or your own domain." },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-5xl font-black text-blue-600">{s.n}</p>
                <h3 className="mt-4 text-xl font-black">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-xs font-extrabold uppercase tracking-[0.3em] text-blue-600">
            Templates
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-3xl font-black tracking-tight">
            Designed for real businesses.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {TEMPLATES.map((t) => (
              <div
                key={t.slug}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className={`h-44 bg-gradient-to-br ${t.preview.bg} flex items-end p-6`}>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    {t.preview.label}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{t.category}</p>
                  <h3 className="mt-1 text-xl font-black">{t.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            Stop fighting your website builder.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Get launched in days, not weekends. Free during launch.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/signup">
              <Button size="lg">Start onboarding →</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LaunchSite
      </footer>
    </div>
  );
}
