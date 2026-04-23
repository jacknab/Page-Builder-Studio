import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sitesTable, usersTable, plansTable } from "@workspace/db/schema";
import { requireAdmin } from "@/lib/session";
import { handleErrors, ok } from "@/lib/api";

export async function GET() {
  return handleErrors(async () => {
    await requireAdmin();
    const rows = await db
      .select({
        site: sitesTable,
        userEmail: usersTable.email,
        planSlug: plansTable.slug,
        planName: plansTable.name,
      })
      .from(sitesTable)
      .leftJoin(usersTable, eq(sitesTable.userId, usersTable.id))
      .leftJoin(plansTable, eq(sitesTable.planId, plansTable.id))
      .orderBy(desc(sitesTable.createdAt));
    return ok({ sites: rows });
  });
}
