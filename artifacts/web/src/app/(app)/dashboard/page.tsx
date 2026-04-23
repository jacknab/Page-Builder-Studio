import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireUser } from "@/lib/session";
import { getSiteByUserId } from "@/lib/sites";
import { getTemplate } from "@/templates/registry";
import { Button } from "@/components/ui/button";
import { DomainForm } from "./domain-form";
import { TemplateSwitcher } from "./template-switcher";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const site = await getSiteByUserId(user.id);
  if (!site) redirect("/onboarding");

  const template = getTemplate(site.templateSlug);
  const h = await headers();
  const host = h.get("host") ?? "localhost";
  const protocol = host.includes("localhost") ? "http" : "https";
  const primary = process.env.PRIMARY_HOST ?? host;
  const subdomainUrl = `${protocol}://${site.slug}.${primary}`;
  const customUrl = site.customDomain ? `https://${site.customDomain}` : null;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Your site</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            {site.content.business?.name ?? site.slug}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Status: <span className="font-bold capitalize">{site.status}</span> · Template:{" "}
            <span className="font-bold">{template?.name ?? site.templateSlug}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/onboarding/edit">
            <Button variant="outline">Edit content</Button>
          </Link>
          <a href={customUrl ?? subdomainUrl} target="_blank" rel="noreferrer">
            <Button>View live site →</Button>
          </a>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-8">
        <h2 className="text-lg font-black">Your URLs</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="font-mono text-slate-700">{subdomainUrl}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Live
            </span>
          </div>
          {customUrl ? (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="font-mono text-slate-700">{customUrl}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Custom domain
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8">
        <h2 className="text-lg font-black">Custom domain</h2>
        <p className="mt-1 text-sm text-slate-600">
          Point an A record from your domain to this server's IP. We'll serve your site at the domain
          you enter below.
        </p>
        <DomainForm initial={site.customDomain ?? ""} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8">
        <h2 className="text-lg font-black">Template</h2>
        <p className="mt-1 text-sm text-slate-600">Switch the look of your site without redoing onboarding.</p>
        <TemplateSwitcher current={site.templateSlug} />
      </section>
    </div>
  );
}
