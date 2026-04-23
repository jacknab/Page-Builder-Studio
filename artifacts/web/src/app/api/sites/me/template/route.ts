import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sitesTable } from "@workspace/db/schema";
import { requireUser } from "@/lib/session";
import { handleErrors, ok, badRequest, notFound } from "@/lib/api";
import { getSiteByUserId } from "@/lib/sites";
import { updateTemplateSchema } from "@/lib/site-validation";

export async function PATCH(req: NextRequest) {
  return handleErrors(async () => {
    const user = await requireUser();
    const site = await getSiteByUserId(user.id);
    if (!site) return notFound("No site found.");

    const parsed = updateTemplateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid template");

    const [updated] = await db
      .update(sitesTable)
      .set({ templateSlug: parsed.data.templateSlug, updatedAt: new Date() })
      .where(eq(sitesTable.id, site.id))
      .returning();
    return ok({ site: updated });
  });
}
