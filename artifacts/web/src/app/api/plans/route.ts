import { db } from "@/lib/db";
import { plansTable } from "@workspace/db/schema";
import { handleErrors, ok } from "@/lib/api";
import { asc } from "drizzle-orm";

export async function GET() {
  return handleErrors(async () => {
    const plans = await db.select().from(plansTable).orderBy(asc(plansTable.sortOrder));
    return ok({ plans });
  });
}
