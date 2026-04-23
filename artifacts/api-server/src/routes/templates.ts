import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, templatesTable } from "@workspace/db";

const router = Router();

// GET /api/templates — list all templates (optional ?type= filter)
router.get("/", async (req, res) => {
  const { type } = req.query as { type?: string };

  const rows = type
    ? await db
        .select()
        .from(templatesTable)
        .where(eq(templatesTable.type, type))
        .orderBy(templatesTable.createdAt)
    : await db
        .select()
        .from(templatesTable)
        .orderBy(templatesTable.createdAt);

  return res.json({ templates: rows });
});

// GET /api/templates/:id — get single template
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });

  const [row] = await db
    .select()
    .from(templatesTable)
    .where(eq(templatesTable.id, id))
    .limit(1);

  if (!row) return res.status(404).json({ error: "Template not found." });

  return res.json({ template: row });
});

// PATCH /api/templates/:id — rename / update description
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });

  const { name, description } = req.body as {
    name?: string;
    description?: string;
  };

  if (!name && !description) {
    return res
      .status(400)
      .json({ error: "Provide at least name or description to update." });
  }

  const updates: Partial<{ name: string; description: string }> = {};
  if (name) updates.name = name.trim();
  if (description !== undefined) updates.description = description.trim();

  const [updated] = await db
    .update(templatesTable)
    .set(updates)
    .where(eq(templatesTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Template not found." });

  return res.json({ template: updated });
});

// DELETE /api/templates/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });

  const [deleted] = await db
    .delete(templatesTable)
    .where(eq(templatesTable.id, id))
    .returning({ id: templatesTable.id });

  if (!deleted) return res.status(404).json({ error: "Template not found." });

  return res.json({ success: true });
});

export default router;
