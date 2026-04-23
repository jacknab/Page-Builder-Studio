import type { TemplateProps } from "./registry";
import { activeHours, activeServices, defaultBusinessName, socialLinks } from "./shared";

export function LuxurySalonTemplate({ content }: TemplateProps) {
  const name = defaultBusinessName(content, "Maison");
  const tagline =
    content.business?.tagline ?? "An intimate studio for those who care about the details.";
  const description =
    content.business?.description ??
    "We craft a quiet, refined experience around every appointment. Tell us about your business and this story will replace the placeholder.";
  const services = activeServices(content);
  const hours = activeHours(content);
  const social = socialLinks(content);
  const accent = content.brand?.accentColor || "#d4a14a";

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-sm font-extrabold uppercase tracking-[0.4em]">{name}</span>
          <nav className="hidden gap-8 text-xs font-bold uppercase tracking-[0.3em] text-stone-400 md:flex">
            <a href="#services">Menu</a>
            <a href="#hours">Hours</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="border-b border-white/5">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.4em]" style={{ color: accent }}>
              {content.business?.address ?? "Studio"}
            </p>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              {tagline}
            </h1>
          </div>
          <p className="text-lg leading-8 text-stone-400">{description}</p>
        </div>
      </section>

      {services.length > 0 ? (
        <section id="services" className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2
              className="text-xs font-extrabold uppercase tracking-[0.4em]"
              style={{ color: accent }}
            >
              The Menu
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-2">
              {services.map((s, i) => (
                <div key={i} className="border-b border-white/10 pb-6">
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="text-2xl font-black tracking-tight">{s.name}</h3>
                    {s.price ? (
                      <span className="text-lg font-bold" style={{ color: accent }}>
                        {s.price}
                      </span>
                    ) : null}
                  </div>
                  {s.description ? (
                    <p className="mt-3 text-sm leading-6 text-stone-400">{s.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hours.length > 0 ? (
        <section id="hours" className="border-b border-white/5">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1fr]">
            <div>
              <h2
                className="text-xs font-extrabold uppercase tracking-[0.4em]"
                style={{ color: accent }}
              >
                Visit
              </h2>
              <p className="mt-6 text-3xl font-black leading-tight tracking-tight md:text-4xl">
                By appointment, in the heart of the neighborhood.
              </p>
            </div>
            <ul className="space-y-4">
              {hours.map((h, i) => (
                <li
                  key={i}
                  className="flex items-baseline justify-between border-b border-white/5 pb-2 text-sm uppercase tracking-[0.2em]"
                >
                  <span className="font-bold">{h.day}</span>
                  <span className="text-stone-400">
                    {h.closed ? "Closed" : `${h.open ?? "—"} – ${h.close ?? "—"}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="contact" className="bg-stone-900">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <h2
              className="text-xs font-extrabold uppercase tracking-[0.4em]"
              style={{ color: accent }}
            >
              Reach Out
            </h2>
            <p className="mt-4 text-3xl font-black tracking-tight">
              {content.business?.phone ?? content.business?.email ?? "We'd love to hear from you."}
            </p>
            <p className="mt-3 text-stone-400">{content.business?.address ?? ""}</p>
          </div>
          {social.length > 0 ? (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.4em] text-stone-500">
                Follow
              </h3>
              <ul className="mt-4 space-y-2">
                {social.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold uppercase tracking-[0.2em]"
                      style={{ color: accent }}
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center text-xs uppercase tracking-[0.3em] text-stone-600">
        © {new Date().getFullYear()} {name} · LaunchSite
      </footer>
    </div>
  );
}
