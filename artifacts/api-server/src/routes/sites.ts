import { Router } from "express";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";
import { db, clientSitesTable, usersTable } from "@workspace/db";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is required");

function requireAuth(req: any, res: any): number | null {
  const auth = req.headers["authorization"] as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return null;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { userId: number };
    return payload.userId;
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
    return null;
  }
}

function sanitizeText(val: unknown, maxLen = 500): string | undefined {
  if (val == null) return undefined;
  return String(val).trim().slice(0, maxLen);
}

function sanitizeUrl(val: unknown): string | undefined {
  if (val == null) return undefined;
  const s = String(val).trim().slice(0, 500);
  if (!s) return undefined;
  if (!/^https?:\/\//i.test(s)) return undefined;
  return s;
}

// POST /api/sites/publish — save or update the calling user's site
router.post("/publish", async (req, res) => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const body = req.body as Record<string, unknown>;

  const subdomain = sanitizeText(body.subdomain, 100);
  const customDomain = sanitizeText(body.customDomain, 200);
  const templateId = sanitizeText(body.templateId, 100);
  const businessType = sanitizeText(body.businessType, 100);
  const businessName = sanitizeText(body.businessName, 200);
  const tagline = sanitizeText(body.tagline, 300);
  const description = sanitizeText(body.description, 2000);
  const phone = sanitizeText(body.phone, 30);
  const email = sanitizeText(body.email, 200);
  const address = sanitizeText(body.address, 300);
  const established = body.established != null ? Number(body.established) : undefined;
  const teamSize = body.teamSize != null ? Number(body.teamSize) : undefined;
  const bookingSlug = sanitizeText(body.bookingSlug, 200);
  const bookingDomain = sanitizeText(body.bookingDomain, 200);
  const googleUrl = sanitizeUrl(body.googleUrl);
  const instagramUrl = sanitizeUrl(body.instagramUrl);
  const facebookUrl = sanitizeUrl(body.facebookUrl);
  const tiktokUrl = sanitizeUrl(body.tiktokUrl);
  const yelpUrl = sanitizeUrl(body.yelpUrl);

  let servicesJson: string | undefined;
  let hoursJson: string | undefined;
  let siteContentJson: string | undefined;
  try {
    if (body.services != null) servicesJson = JSON.stringify(body.services);
    if (body.hours != null) hoursJson = JSON.stringify(body.hours);
    if (body.siteContent != null) siteContentJson = JSON.stringify(body.siteContent);
  } catch {
    return res.status(400).json({ error: "Invalid JSON in services/hours/siteContent." });
  }

  const existing = await db
    .select({ id: clientSitesTable.id })
    .from(clientSitesTable)
    .where(eq(clientSitesTable.userId, userId))
    .limit(1);

  const values = {
    userId,
    subdomain,
    customDomain,
    status: "live",
    templateId,
    businessType,
    businessName,
    tagline,
    description,
    phone,
    email,
    address,
    ...(established != null && !isNaN(established) ? { established } : {}),
    ...(teamSize != null && !isNaN(teamSize) ? { teamSize } : {}),
    bookingSlug,
    bookingDomain,
    servicesJson,
    hoursJson,
    siteContentJson,
    googleUrl,
    instagramUrl,
    facebookUrl,
    tiktokUrl,
    yelpUrl,
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(clientSitesTable)
      .set(values)
      .where(eq(clientSitesTable.userId, userId));
    return res.json({ success: true, subdomain });
  } else {
    await db.insert(clientSitesTable).values(values);
    return res.status(201).json({ success: true, subdomain });
  }
});

// GET /api/sites/:slug — public, returns site data as JSON
router.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug).trim().toLowerCase().slice(0, 100);
  if (!slug) return res.status(400).json({ error: "Missing slug." });

  const [site] = await db
    .select()
    .from(clientSitesTable)
    .where(eq(clientSitesTable.subdomain, slug))
    .limit(1);

  if (!site) return res.status(404).json({ error: "Site not found." });

  let services: unknown[] = [];
  let hours: Record<string, string> = {};
  let siteContent: Record<string, unknown> = {};
  try { if (site.servicesJson) services = JSON.parse(site.servicesJson); } catch {}
  try { if (site.hoursJson) hours = JSON.parse(site.hoursJson); } catch {}
  try { if (site.siteContentJson) siteContent = JSON.parse(site.siteContentJson); } catch {}

  return res.json({
    themeId: site.templateId ?? "rose-quartz",
    businessName: site.businessName ?? "",
    tagline: site.tagline ?? "",
    description: site.description ?? "",
    phone: site.phone ?? "",
    email: site.email ?? "",
    address: site.address ?? "",
    established: site.established ?? undefined,
    teamSize: site.teamSize ?? undefined,
    bookingSlug: site.bookingSlug ?? "",
    bookingDomain: site.bookingDomain ?? "",
    services,
    hours,
    siteContent,
    googleUrl: site.googleUrl ?? "",
    instagramUrl: site.instagramUrl ?? "",
    facebookUrl: site.facebookUrl ?? "",
    tiktokUrl: site.tiktokUrl ?? "",
    yelpUrl: site.yelpUrl ?? "",
  });
});

export default router;
