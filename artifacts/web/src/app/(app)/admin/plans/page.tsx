import Link from "next/link";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { plansTable } from "@workspace/db/schema";
import { PlansEditor } from "./plans-editor";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  await requireAdmin();
  const plans = await db.select().from(plansTable).orderBy(asc(plansTable.sortOrder));
  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin" className="text-sm font-bold text-blue-600 hover:underline">
          ← All sites
        </Link>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Plans</h1>
        <p className="text-sm text-slate-600">Manage your three offerings.</p>
      </header>
      <PlansEditor initial={plans} />
    </div>
  );
}
