import { Rocket } from "lucide-react";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/templates", label: "Templates" },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export default function Layout({ children, currentPath = "/" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f1e8] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-[#f5f1e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Rocket className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Launchsite</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition hover:text-slate-950 ${
                  currentPath === link.href ? "text-slate-950" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/templates"
              className="hidden text-sm font-semibold text-slate-600 hover:text-slate-950 sm:block"
            >
              Browse templates
            </a>
            <a
              href="https://164a3cac-ef64-450d-9bb9-d4905098b5ba-00-mr6ywxt9wxoc.kirk.replit.dev/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
            >
              Launch my site
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Rocket className="h-4 w-4" />
              </span>
              <span className="font-extrabold tracking-tight">Launchsite</span>
            </a>
            <nav className="flex items-center gap-6 text-sm font-semibold text-slate-500">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-slate-900">
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-slate-400">© 2026 Launchsite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
