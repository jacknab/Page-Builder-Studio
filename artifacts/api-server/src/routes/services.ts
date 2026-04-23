import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, presetServicesTable } from "@workspace/db";

const router = Router();

const VALID_BUSINESS_TYPES = ["nail-salon", "hair-salon", "haircut-studio", "barbershop"];

// GET /api/services/presets?businessType=barbershop
router.get("/presets", async (req, res) => {
  const { businessType } = req.query as { businessType?: string };

  if (!businessType) {
    return res.status(400).json({ error: "businessType query param is required." });
  }

  if (!VALID_BUSINESS_TYPES.includes(businessType)) {
    return res.status(400).json({
      error: `businessType must be one of: ${VALID_BUSINESS_TYPES.join(", ")}`,
    });
  }

  const rows = await db
    .select()
    .from(presetServicesTable)
    .where(eq(presetServicesTable.businessType, businessType))
    .orderBy(asc(presetServicesTable.sortOrder));

  return res.json({
    businessType,
    services: rows.map((r) => ({
      id: String(r.id),
      name: r.name,
      price: r.defaultPrice,
    })),
  });
});

export default router;
