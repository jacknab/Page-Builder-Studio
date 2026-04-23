import { notFound } from "next/navigation";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { plansTable } from "@workspace/db/schema";
import { getSiteById } from "@/lib/sites";
import { TEMPLATES } from "@/templates/registry";
import { AdminSiteForm } from "./admin-site-form";

export const dynamic = "force-dynamic";

export default async function AdminSitePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const site = await getSiteById(Number(id));
  if (!site) notFound();
  const plans = await db.select().from(plansTable).orderBy(asc(plansTable.sortOrder));

  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin" className="text-sm font-bold text-blue-600 hover:underline">
          ← All sites
        </Link>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {site.content.business?.name ?? site.slug}
        </h1>
        <p className="text-sm text-slate-600">Site #{site.id}</p>
      </header>

      <AdminSiteForm
        site={site}
        plans={plans.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))}
        templates={TEMPLATES.map((t) => ({ slug: t.slug, name: t.name }))}
      />
    </div>
  );
}
