import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { sitesTable, plansTable } from "@workspace/db/schema";
import { requireAdmin } from "@/lib/session";
import { handleErrors, ok, badRequest, notFound } from "@/lib/api";
import { getSiteById, isCustomDomainAvailable } from "@/lib/sites";
import { siteContentSchema } from "@/lib/site-validation";
import { TEMPLATES } from "@/templates/registry";

const templateSlugs = TEMPLATES.map((t) => t.slug) as [string, ...string[]];

const adminUpdateSchema = z.object({
  templateSlug: z.enum(templateSlugs).optional(),
  planId: z.number().int().positive().optional(),
  customDomain: z.string().trim().toLowerCase().nullable().optional(),
  status: z.enum(["draft", "live", "suspended"]).optional(),
  content: siteContentSchema.optional(),
});

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return handleErrors(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const site = await getSiteById(Number(id));
    if (!site) return notFound("Site not found");
    return ok({ site });
  });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return handleErrors(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const siteId = Number(id);
    const existing = await getSiteById(siteId);
    if (!existing) return notFound("Site not found");

    const parsed = adminUpdateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message ?? "Invalid input");

    if (parsed.data.planId) {
      const [plan] = await db.select({ id: plansTable.id }).from(plansTable).where(eq(plansTable.id, parsed.data.planId)).limit(1);
      if (!plan) return badRequest("Plan not found");
    }

    if (parsed.data.customDomain && !(await isCustomDomainAvailable(parsed.data.customDomain, siteId))) {
      return badRequest("Domain already mapped to another site.");
    }

    const [updated] = await db
      .update(sitesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(sitesTable.id, siteId))
      .returning();
    return ok({ site: updated });
  });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return handleErrors(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    await db.delete(sitesTable).where(eq(sitesTable.id, Number(id)));
    return ok({ ok: true });
  });
}
