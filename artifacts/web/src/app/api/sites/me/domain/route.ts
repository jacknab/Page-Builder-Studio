import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sitesTable } from "@workspace/db/schema";
import { requireUser } from "@/lib/session";
import { handleErrors, ok, badRequest, notFound } from "@/lib/api";
import { getSiteByUserId, isCustomDomainAvailable } from "@/lib/sites";
import { updateDomainSchema } from "@/lib/site-validation";

export async function PATCH(req: NextRequest) {
  return handleErrors(async () => {
    const user = await requireUser();
    const site = await getSiteByUserId(user.id);
    if (!site) return notFound("No site found.");

    const parsed = updateDomainSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid domain");

    if (parsed.data.customDomain && !(await isCustomDomainAvailable(parsed.data.customDomain, site.id))) {
      return badRequest("This domain is already mapped to another site.");
    }

    const [updated] = await db
      .update(sitesTable)
      .set({
        customDomain: parsed.data.customDomain,
        updatedAt: new Date(),
      })
      .where(eq(sitesTable.id, site.id))
      .returning();

    return ok({ site: updated });
  });
}
