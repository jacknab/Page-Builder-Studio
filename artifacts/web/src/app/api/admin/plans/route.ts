import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { plansTable } from "@workspace/db/schema";
import { requireAdmin } from "@/lib/session";
import { handleErrors, ok, badRequest } from "@/lib/api";

const planSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  priceCents: z.number().int().min(0),
  allowsCustomDomain: z.boolean().optional(),
  allowsDomainPurchase: z.boolean().optional(),
  maxSites: z.number().int().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export async function GET() {
  return handleErrors(async () => {
    await requireAdmin();
    const plans = await db.select().from(plansTable).orderBy(asc(plansTable.sortOrder));
    return ok({ plans });
  });
}

export async function PATCH(req: NextRequest) {
  return handleErrors(async () => {
    await requireAdmin();
    const parsed = planSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");

    const { id, ...rest } = parsed.data;
    const [updated] = await db
      .update(plansTable)
      .set(rest)
      .where(eq(plansTable.id, id))
      .returning();
    return ok({ plan: updated });
  });
}
