import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { sitesTable, usersTable, plansTable } from "@workspace/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();
  const rows = await db
    .select({
      site: sitesTable,
      userEmail: usersTable.email,
      planName: plansTable.name,
    })
    .from(sitesTable)
    .leftJoin(usersTable, eq(sitesTable.userId, usersTable.id))
    .leftJoin(plansTable, eq(sitesTable.planId, plansTable.id))
    .orderBy(desc(sitesTable.createdAt));

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Admin</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Client sites</h1>
        </div>
        <div className="flex gap-2 text-sm font-bold">
          <Link href="/admin/plans" className="text-blue-600 hover:underline">Plans →</Link>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Business</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Domain</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-slate-500" colSpan={7}>
                  No client sites yet.
                </td>
              </tr>
            ) : null}
            {rows.map(({ site, userEmail, planName }) => (
              <tr key={site.id}>
                <td className="px-5 py-3 font-bold">{site.content.business?.name ?? "—"}</td>
                <td className="px-5 py-3 text-slate-600">{userEmail}</td>
                <td className="px-5 py-3 text-slate-600">{planName}</td>
                <td className="px-5 py-3 font-mono text-xs">{site.slug}</td>
                <td className="px-5 py-3 font-mono text-xs">{site.customDomain ?? "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      site.status === "live"
                        ? "bg-emerald-100 text-emerald-700"
                        : site.status === "suspended"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {site.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/sites/${site.id}`} className="font-bold text-blue-600 hover:underline">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
