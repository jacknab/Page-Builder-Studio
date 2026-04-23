import "server-only";
import { eq, and, ne } from "drizzle-orm";
import { db } from "./db";
import { sitesTable, plansTable, type Site, type SiteContent } from "@workspace/db/schema";
import { slugify, randomSlugSuffix } from "./utils";

export async function getSiteByUserId(userId: number): Promise<Site | undefined> {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.userId, userId)).limit(1);
  return site;
}

export async function getSiteById(id: number): Promise<Site | undefined> {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.id, id)).limit(1);
  return site;
}

export async function getSiteBySlug(slug: string): Promise<Site | undefined> {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.slug, slug)).limit(1);
  return site;
}

export async function getSiteByDomain(domain: string): Promise<Site | undefined> {
  const normalized = domain.toLowerCase();
  const [site] = await db
    .select()
    .from(sitesTable)
    .where(eq(sitesTable.customDomain, normalized))
    .limit(1);
  return site;
}

export async function getDefaultPlan(): Promise<{ id: number; slug: string }> {
  const [plan] = await db
    .select({ id: plansTable.id, slug: plansTable.slug })
    .from(plansTable)
    .where(eq(plansTable.slug, "domain-forward"))
    .limit(1);
  if (!plan) throw new Error("Default plan not seeded");
  return plan;
}

export async function generateUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "site";
  let candidate = root;
  for (let attempt = 0; attempt < 6; attempt++) {
    const existing = await db
      .select({ id: sitesTable.id })
      .from(sitesTable)
      .where(eq(sitesTable.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    candidate = `${root}-${randomSlugSuffix()}`;
  }
  throw new Error("Unable to generate a unique slug");
}

export async function isCustomDomainAvailable(domain: string, excludeSiteId?: number): Promise<boolean> {
  const normalized = domain.toLowerCase();
  const rows = await db
    .select({ id: sitesTable.id })
    .from(sitesTable)
    .where(
      excludeSiteId
        ? and(eq(sitesTable.customDomain, normalized), ne(sitesTable.id, excludeSiteId))
        : eq(sitesTable.customDomain, normalized),
    )
    .limit(1);
  return rows.length === 0;
}

export function emptyContent(): SiteContent {
  return {};
}
