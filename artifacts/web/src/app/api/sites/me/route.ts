import { NextRequest } from "next/server";
import { handleErrors, ok, badRequest } from "@/lib/api";
import { requireUser } from "@/lib/session";
import {
  emptyContent,
  generateUniqueSlug,
  getDefaultPlan,
  getSiteByUserId,
} from "@/lib/sites";
import { onboardingSchema, updateContentSchema } from "@/lib/site-validation";
import { db } from "@/lib/db";
import { sitesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  return handleErrors(async () => {
    const user = await requireUser();
    const site = await getSiteByUserId(user.id);
    return ok({ site: site ?? null });
  });
}

export async function POST(req: NextRequest) {
  return handleErrors(async () => {
    const user = await requireUser();
    const existing = await getSiteByUserId(user.id);
    if (existing) return badRequest("You already have a site. Edit it instead.");

    const parsed = onboardingSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid input", parsed.error.flatten());
    }

    const plan = await getDefaultPlan();
    const businessName = parsed.data.content.business?.name ?? user.email.split("@")[0];
    const slug = await generateUniqueSlug(businessName);

    const [site] = await db
      .insert(sitesTable)
      .values({
        userId: user.id,
        planId: plan.id,
        slug,
        templateSlug: parsed.data.templateSlug,
        status: "live",
        content: { ...emptyContent(), ...parsed.data.content },
      })
      .returning();

    return ok({ site }, { status: 201 });
  });
}

export async function PATCH(req: NextRequest) {
  return handleErrors(async () => {
    const user = await requireUser();
    const existing = await getSiteByUserId(user.id);
    if (!existing) return badRequest("No site found. Complete onboarding first.");

    const parsed = updateContentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid input", parsed.error.flatten());
    }

    const [site] = await db
      .update(sitesTable)
      .set({ content: parsed.data, updatedAt: new Date() })
      .where(eq(sitesTable.id, existing.id))
      .returning();

    return ok({ site });
  });
}
