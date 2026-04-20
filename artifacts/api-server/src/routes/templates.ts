import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, templatesTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const STYLE_INSTRUCTIONS: Record<string, string> = {
  luxury:
    "Use a luxury aesthetic: dark backgrounds (deep navy or near-black), gold accents, elegant serif fonts, generous whitespace, and a premium high-end feel.",
  modern:
    "Use a modern aesthetic: clean whites and grays, sans-serif fonts, bold typography, card-based layouts, and a tech-forward minimal look.",
  minimal:
    "Use a minimal aesthetic: lots of whitespace, muted color palette, thin fonts, subtle borders, and stripped-back simplicity.",
  bold:
    "Use a bold aesthetic: vibrant colors (bright pinks, purples, or reds), large eye-catching headlines, strong contrast, and energetic layout.",
};

function buildPrompt(type: string, style: string): string {
  const styleInstruction =
    STYLE_INSTRUCTIONS[style] ??
    "Use a clean modern aesthetic with a professional look.";

  return `You are generating a website template for a SaaS website builder targeting ${type} businesses.

Return ONLY valid HTML. No explanations, no markdown, no code fences — just the raw HTML document.

Requirements:
- Fully responsive layout using inline CSS only (no external stylesheets, no frameworks)
- ${styleInstruction}
- Must include these four sections in order:
  1. Hero section — compelling headline, subheadline, and a call-to-action button
  2. Services section — list at least 4 specific ${type} services with icons (use unicode emoji) and short descriptions
  3. Gallery section — show 6 image placeholders using https://picsum.photos/400/300?random=N (replace N with 1-6)
  4. Contact section — include a simple contact form (name, email, message, submit) and business address/phone placeholder
- Use a consistent color palette and typography throughout
- Include a sticky navigation bar with the business name and nav links
- Include a footer with copyright

Generate a complete, production-ready HTML page for a ${type} business.`;
}

// POST /api/templates/generate
router.post("/generate", async (req, res) => {
  const { type, style, name, description } = req.body as {
    type?: string;
    style?: string;
    name?: string;
    description?: string;
  };

  if (!type || !style) {
    return res.status(400).json({ error: "type and style are required." });
  }

  const validStyles = ["luxury", "modern", "minimal", "bold"];
  if (!validStyles.includes(style)) {
    return res
      .status(400)
      .json({ error: `style must be one of: ${validStyles.join(", ")}` });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "user",
          content: buildPrompt(type, style),
        },
      ],
    });

    const html = completion.choices[0]?.message?.content ?? "";

    if (!html.trim()) {
      return res.status(500).json({ error: "AI returned empty response." });
    }

    const templateName =
      name?.trim() ||
      `${type.replace(/-/g, " ")} — ${style.charAt(0).toUpperCase() + style.slice(1)}`;

    const templateDescription =
      description?.trim() ||
      `AI-generated ${style} template for ${type.replace(/-/g, " ")} businesses.`;

    const [saved] = await db
      .insert(templatesTable)
      .values({
        name: templateName,
        type,
        style,
        description: templateDescription,
        html,
      })
      .returning();

    return res.status(201).json({ template: saved });
  } catch (err) {
    console.error("Template generation error:", err);
    return res.status(500).json({ error: "Failed to generate template." });
  }
});

// POST /api/templates/generate-batch — generate multiple styles at once
router.post("/generate-batch", async (req, res) => {
  const { type, styles } = req.body as {
    type?: string;
    styles?: string[];
  };

  if (!type || !Array.isArray(styles) || styles.length === 0) {
    return res
      .status(400)
      .json({ error: "type and styles array are required." });
  }

  const validStyles = ["luxury", "modern", "minimal", "bold"];
  const invalid = styles.filter((s) => !validStyles.includes(s));
  if (invalid.length > 0) {
    return res
      .status(400)
      .json({ error: `Invalid styles: ${invalid.join(", ")}` });
  }

  try {
    const results = await Promise.allSettled(
      styles.map(async (style) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
          max_completion_tokens: 8192,
          messages: [{ role: "user", content: buildPrompt(type, style) }],
        });

        const html = completion.choices[0]?.message?.content ?? "";
        if (!html.trim()) throw new Error("Empty response from AI");

        const templateName = `${type.replace(/-/g, " ")} — ${style.charAt(0).toUpperCase() + style.slice(1)}`;
        const templateDescription = `AI-generated ${style} template for ${type.replace(/-/g, " ")} businesses.`;

        const [saved] = await db
          .insert(templatesTable)
          .values({ name: templateName, type, style, description: templateDescription, html })
          .returning();

        return saved;
      })
    );

    const templates = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<typeof templatesTable.$inferSelect>).value);

    const failures = results.filter((r) => r.status === "rejected").length;

    return res.status(201).json({ templates, failures });
  } catch (err) {
    console.error("Batch generation error:", err);
    return res.status(500).json({ error: "Failed to generate templates." });
  }
});

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
