import type { TemplateProps } from "./registry";
import { activeHours, activeServices, defaultBusinessName, socialLinks } from "./shared";

export function ModernServicesTemplate({ content }: TemplateProps) {
  const name = defaultBusinessName(content);
  const tagline = content.business?.tagline ?? "Booking trusted local clients every week.";
  const description =
    content.business?.description ??
    "Tell us a little about what you do and we'll display it here for your visitors.";
  const services = activeServices(content);
  const hours = activeHours(content);
  const social = socialLinks(content);
  const accent = content.brand?.primaryColor || "#2563eb";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-extrabold tracking-tight">{name}</span>
          <nav className="hidden gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#services">Services</a>
            <a href="#hours">Hours</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em]" style={{ color: accent }}>
          {content.business?.address ? content.business.address : "Local business"}
        </p>
        <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
          {tagline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {content.business?.phone ? (
            <a
              href={`tel:${content.business.phone}`}
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-extrabold text-white"
              style={{ background: accent }}
            >
              Call {content.business.phone}
            </a>
          ) : null}
          {content.googleListingUrl ? (
            <a
              href={content.googleListingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900"
            >
              View on Google
            </a>
          ) : null}
        </div>
      </section>

      {services.length > 0 ? (
        <section id="services" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Services & pricing</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {services.map((s, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-extrabold">{s.name}</h3>
                    {s.price ? (
                      <span
                        className="shrink-0 rounded-full px-3 py-1 text-sm font-extrabold text-white"
                        style={{ background: accent }}
                      >
                        {s.price}
                      </span>
                    ) : null}
                  </div>
                  {s.description ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">{s.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hours.length > 0 ? (
        <section id="hours" className="border-t border-slate-100">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">Business hours</h2>
              <p className="mt-3 text-slate-600">When you can reach us in store or by phone.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <ul className="divide-y divide-slate-100">
                {hours.map((h, i) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <span className="font-bold">{h.day}</span>
                    <span className="text-slate-600">
                      {h.closed ? "Closed" : `${h.open ?? "—"} – ${h.close ?? "—"}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section id="contact" className="border-t border-slate-100 bg-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Get in touch</h2>
            <p className="mt-3 text-white/70">{content.business?.address ?? "Visit us locally."}</p>
            {content.business?.email ? (
              <p className="mt-2 text-white/70">
                <a href={`mailto:${content.business.email}`} className="underline">
                  {content.business.email}
                </a>
              </p>
            ) : null}
            {content.business?.phone ? (
              <p className="mt-2 text-white/70">
                <a href={`tel:${content.business.phone}`} className="underline">
                  {content.business.phone}
                </a>
              </p>
            ) : null}
          </div>
          {social.length > 0 ? (
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white/60">Follow</h3>
              <ul className="mt-4 space-y-2">
                {social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-sm text-white/40">
        © {new Date().getFullYear()} {name}. Powered by LaunchSite.
      </footer>
    </div>
  );
}
