import Link from "next/link";
import { TEMPLATES } from "@/templates/registry";

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: "linear-gradient(180deg, #f5efe4 0%, #e8e1d5 40%, #dfd8cc 100%)", color: "#111" }}>

      {/* ── Nav ────────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="8" width="12" height="2" rx="1" fill="white"/>
                  <rect x="8" y="3" width="2" height="12" rx="1" fill="white"/>
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>
                LaunchSite{" "}
                <span style={{ fontWeight: 400, color: "#888" }}>by Certxa</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              {["Features", "How it works", "Templates"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  style={{ fontSize: 14, fontWeight: 500, color: "#444", textDecoration: "none" }}
                  className="hover:text-black transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              style={{ fontSize: 14, fontWeight: 500, color: "#444", textDecoration: "none" }}
              className="hover:text-black transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: 14,
                fontWeight: 600,
                background: "#1d4ed8",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 100,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              className="hover:bg-blue-700 transition-colors"
            >
              Start building <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-8 py-20 md:py-28">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left */}
          <div>
            <div
              className="mb-8 inline-flex items-center gap-2"
              style={{
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 100,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontWeight: 500,
                color: "#333",
              }}
            >
              <span style={{ color: "#1d4ed8", fontSize: 12 }}>✦</span>
              Website pages built for fast launches
            </div>

            <h1
              style={{
                fontSize: "clamp(52px, 7vw, 82px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                margin: 0,
              }}
            >
              Launch a polished website page in minutes, not weeks.
            </h1>

            <p
              style={{
                marginTop: 28,
                fontSize: 17,
                lineHeight: 1.65,
                color: "#555",
                maxWidth: 460,
              }}
            >
              LaunchSite by Certxa helps salons, barbershops, nail studios, and service businesses
              get a stunning website live — without touching a line of code.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                style={{
                  background: "#1d4ed8",
                  color: "#fff",
                  padding: "16px 32px",
                  borderRadius: 100,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                }}
                className="hover:bg-blue-700 transition-colors"
              >
                Start building →
              </Link>
              <a
                href="#templates"
                style={{ fontSize: 14, fontWeight: 600, color: "#333", textDecoration: "underline", textUnderlineOffset: 4 }}
              >
                Browse templates
              </a>
            </div>
          </div>

          {/* Right — App mockup */}
          <div className="hidden md:block">
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)",
                background: "#fff",
              }}
            >
              {/* Browser bar */}
              <div style={{ background: "#f5f5f5", borderBottom: "1px solid #e5e5e5", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }}/>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }}/>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }}/>
                <span style={{ marginLeft: 12, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#888", fontWeight: 500 }}>
                  LaunchSite Studio · Certxa
                </span>
              </div>

              <div style={{ display: "flex", minHeight: 340 }}>
                {/* Sidebar */}
                <div style={{ width: 180, borderRight: "1px solid #f0f0f0", background: "#fafafa", padding: 12 }}>
                  <div style={{ background: "#1d4ed8", color: "#fff", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                    Hero
                  </div>
                  {["Services", "Reviews", "Contact"].map((item) => (
                    <div key={item} style={{ padding: "10px 14px", fontSize: 13, color: "#888" }}>{item}</div>
                  ))}

                  {/* Ready badge */}
                  <div style={{ marginTop: 16, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>Ready to publish</div>
                        <div style={{ fontSize: 11, color: "#16a34a", marginTop: 1 }}>Desktop + mobile checked</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview panel */}
                <div style={{ flex: 1, background: "#1d4ed8", padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                    Your business
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                    Your business deserves a better first impression.
                  </div>
                  <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                    Replace placeholder content with your real copy in seconds.
                  </div>
                  <div style={{ marginTop: 20, display: "inline-flex", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, width: "fit-content" }}>
                    Book now →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.25)", padding: "96px 0" }}>
        <div className="mx-auto max-w-7xl px-8">
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: 12 }}>Why LaunchSite</p>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 56, maxWidth: 560 }}>
            Skip the builder, get the site.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: "⚡", title: "Live in minutes", desc: "Answer a short questionnaire about your business and we configure and launch your site. No design decisions needed." },
              { icon: "🎨", title: "Industry-tuned designs", desc: "Every template is crafted for a specific type of service business — salons, barbershops, studios, and more." },
              { icon: "🌐", title: "Your domain, sorted", desc: "Point your existing domain or let us help you get one. We handle the DNS configuration so you don't have to." },
            ].map((f) => (
              <div key={f.title} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 32 }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "96px 0" }}>
        <div className="mx-auto max-w-7xl px-8">
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 56 }}>
            Three steps, then you're live.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Pick a template", d: "Browse designs built for your type of business and choose the one that fits your brand." },
              { n: "02", t: "Fill in the details", d: "Tell us your business name, services, hours, and social links. Takes under 5 minutes." },
              { n: "03", t: "We launch it", d: "Your site goes live on a subdomain instantly. Connect your own domain whenever you're ready." },
            ].map((s) => (
              <div key={s.n} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 32 }}>
                <div style={{ fontSize: 52, fontWeight: 900, color: "#1d4ed8", lineHeight: 1, marginBottom: 20, letterSpacing: "-0.04em" }}>{s.n}</div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>{s.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates ──────────────────────────────────── */}
      <section id="templates" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.25)", padding: "96px 0" }}>
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1d4ed8", marginBottom: 12 }}>Templates</p>
              <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 520 }}>
                Find the right look for your business.
              </h2>
              <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: "#555", maxWidth: 480 }}>
                Preview the templates available in LaunchSite. Pick one you like and create an account to get it live with your business info.
              </p>
            </div>
            <Link
              href="/signup"
              style={{ background: "#1d4ed8", color: "#fff", padding: "14px 28px", borderRadius: 100, fontWeight: 600, fontSize: 14, textDecoration: "none", flexShrink: 0 }}
              className="hover:bg-blue-700 transition-colors"
            >
              See all in the editor →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <Link
                href="/signup"
                key={t.slug}
                style={{ display: "block", background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, overflow: "hidden", textDecoration: "none", color: "inherit" }}
                className="group hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`h-52 bg-gradient-to-br ${t.preview.bg} relative flex items-end p-5`}>
                  <span
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
                  >
                    {t.preview.label}
                  </span>
                </div>
                <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>{t.name}</div>
                    <div style={{ marginTop: 4, display: "inline-block", background: "#f0f4ff", color: "#3b5bdb", borderRadius: 100, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                      {t.category}
                    </div>
                  </div>
                  <span style={{ color: "#aaa", transition: "transform 0.2s" }} className="group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}

            {["Restaurant", "Fitness studio", "Med spa", "Real estate"].map((name) => (
              <div
                key={name}
                style={{ background: "rgba(255,255,255,0.4)", border: "1px dashed rgba(0,0,0,0.15)", borderRadius: 16, overflow: "hidden" }}
              >
                <div style={{ height: 208, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>{name}</div>
                  <div style={{ marginTop: 4, display: "inline-block", background: "#f5f5f5", color: "#bbb", borderRadius: 100, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                    Coming soon
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ padding: "120px 0" }}>
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 style={{ fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0 }}>
            Ready to launch?
          </h2>
          <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.65, color: "#555" }}>
            Get your business website live today. Free to start — bring your own domain whenever you're ready.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              style={{ background: "#1d4ed8", color: "#fff", padding: "18px 40px", borderRadius: 100, fontWeight: 700, fontSize: 16, textDecoration: "none" }}
              className="hover:bg-blue-700 transition-colors"
            >
              Start building for free →
            </Link>
            <Link
              href="/login"
              style={{ background: "#fff", color: "#333", border: "1px solid rgba(0,0,0,0.15)", padding: "18px 40px", borderRadius: 100, fontWeight: 600, fontSize: 16, textDecoration: "none" }}
              className="hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "28px 0" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-8">
          <div className="flex items-center gap-2">
            <div style={{ width: 28, height: 28, background: "#1d4ed8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="8" width="12" height="2" rx="1" fill="white"/>
                <rect x="8" y="3" width="2" height="12" rx="1" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>LaunchSite <span style={{ fontWeight: 400, color: "#888" }}>by Certxa</span></span>
          </div>
          <p style={{ fontSize: 13, color: "#999" }}>© {new Date().getFullYear()} Certxa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
