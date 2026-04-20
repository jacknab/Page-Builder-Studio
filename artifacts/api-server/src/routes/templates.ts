import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, templatesTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const SYSTEM_PROMPT = `You are an expert senior UI/UX designer and front-end architect generating premium website templates for a SaaS website builder platform.

Your output is used directly in production websites for small businesses, so quality must be extremely high.

# CORE RULES (NON-NEGOTIABLE)
* Output MUST be valid HTML only — no explanations, no comments, no markdown
* No repeated or cookie-cutter layouts
* Every template must be visually unique and structurally different
* Do not reuse common template patterns (hero → services → gallery → contact)

# DESIGN QUALITY REQUIREMENTS
Each template must feel like a custom agency-built website. Vary layout structure (grid, split-screen, editorial, asymmetrical, stacked, layered), visual hierarchy, section ordering, and spacing style. Include at least one creative layout element: split-screen hero, overlapping sections, side-scrolling gallery, sticky visual column, or diagonal section transitions.

# RESPONSIVE DESIGN (CRITICAL)
* Must work perfectly at 375px width
* Use flexbox or CSS grid for all layouts
* No fixed-width containers for page structure
* All sections must stack cleanly on mobile
* Images must scale proportionally and never overflow
* Typography must scale using relative units (rem/em)
* No horizontal scrolling at any screen size

# SEO REQUIREMENTS
* Exactly one H1 tag
* Proper semantic HTML (header, section, footer)
* Logical heading hierarchy (H1 → H2 → H3)
* Meta title and meta description tags
* Descriptive alt text for all images
* Include location + service context naturally

# PERFORMANCE RULES
* Inline CSS only — no external frameworks or libraries
* Keep HTML lightweight and fast-loading

# STRUCTURE REQUIREMENTS
* Hero section
* At least 3 distinct content sections (not repetitive cards)
* Contact section with a form
But structure must NOT feel formulaic or repetitive.

# FINAL OUTPUT GOAL
The result must feel like a premium $3,000–$10,000 custom-designed website built by a top-tier design agency. NOT a template generator output.`;

const STYLE_PALETTE: Record<string, string> = {
  luxury:
    "Color palette: deep navy (#0a0a1a), champagne gold (#c9a96e), ivory (#faf8f3). Typography: elegant serif headings (Georgia/Playfair Display stack), refined sans-serif body. Mood: high-end, exclusive, hushed opulence.",
  modern:
    "Color palette: crisp white (#ffffff), electric indigo (#4f46e5), slate (#1e293b). Typography: bold geometric sans-serif (system-ui stack). Mood: confident, tech-forward, clean precision.",
  minimal:
    "Color palette: warm off-white (#fafaf8), charcoal (#222), single accent in dusty rose (#c4a5a0). Typography: thin-weight sans-serif, generous letter-spacing. Mood: refined restraint, gallery-like silence.",
  bold:
    "Color palette: near-black (#0f0f0f), hot coral (#ff4d4d), electric lime (#ccff00). Typography: heavy black-weight sans-serif, oversized display text. Mood: unapologetic, editorial, high-energy.",
};

const LAYOUT_VARIANTS = [
  "split-screen hero with image on left half and text on right half — no standard stacked sections",
  "editorial magazine grid — asymmetric columns, text overlapping imagery, unexpected white space",
  "full-bleed image hero with overlapping content card floating over it — diagonal section break into services",
  "sticky left sidebar navigation with scrolling right-side content panels",
  "offset hero with large headline spanning across a background image, services in a horizontal scroll strip",
  "layered hero composition — text in foreground, blurred image layer behind, content sections with alternating left/right layout",
];

// Curated nail-salon-specific image pools — keyword-locked for topic relevance
const NAIL_IMAGES = {
  hero: [
    "https://loremflickr.com/1400/800/nail,salon,luxury?lock=101",
    "https://loremflickr.com/1400/800/manicure,nails,studio?lock=102",
    "https://loremflickr.com/1400/800/beauty,salon,spa?lock=103",
    "https://loremflickr.com/1400/800/manicure,nails,elegant?lock=104",
  ],
  services: [
    "https://loremflickr.com/800/600/nail,manicure,tools?lock=201",
    "https://loremflickr.com/800/600/gel,nails,hands?lock=202",
    "https://loremflickr.com/800/600/nail,polish,beauty?lock=203",
    "https://loremflickr.com/800/600/manicure,spa,hands?lock=204",
  ],
  gallery: [
    "https://loremflickr.com/600/600/nail,art,design?lock=301",
    "https://loremflickr.com/600/600/manicure,nails,pink?lock=302",
    "https://loremflickr.com/600/600/gel,nails,design?lock=303",
    "https://loremflickr.com/600/600/nail,art,macro?lock=304",
    "https://loremflickr.com/600/600/nails,beauty,fashion?lock=305",
    "https://loremflickr.com/600/600/nail,glitter,design?lock=306",
  ],
  about: [
    "https://loremflickr.com/900/600/salon,interior,beauty?lock=401",
    "https://loremflickr.com/900/600/spa,interior,minimal?lock=402",
    "https://loremflickr.com/900/600/nail,technician,working?lock=403",
  ],
  contact: [
    "https://loremflickr.com/900/600/salon,desk,reception?lock=501",
    "https://loremflickr.com/900/600/spa,reception,minimal?lock=502",
    "https://loremflickr.com/900/600/beauty,salon,interior?lock=503",
  ],
};

function buildPrompt(type: string, style: string): string {
  const palette = STYLE_PALETTE[style] ?? STYLE_PALETTE["modern"];
  const layout = LAYOUT_VARIANTS[Math.floor(Math.random() * LAYOUT_VARIANTS.length)];

  return `Generate a single-page HTML website for a ${type.replace(/-/g, " ")} business.

STYLE: ${style}
${palette}

LAYOUT INSTRUCTION: ${layout}

IMAGE RULES (NON-NEGOTIABLE):
- Use ONLY the URLs listed below. Do not invent URLs. Do not use picsum.photos or any other service.
- Every <img> must have descriptive alt text relevant to nail salon context.

Hero section — pick ONE:
${NAIL_IMAGES.hero.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Services section — use 1–2 of these:
${NAIL_IMAGES.services.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Gallery section — use ALL 6 in a creative (non-uniform) layout:
${NAIL_IMAGES.gallery.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

About section — pick ONE:
${NAIL_IMAGES.about.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Contact section — pick ONE:
${NAIL_IMAGES.contact.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Include a realistic business name, phone number, address, and service descriptions.
Output only the complete HTML document starting with <!DOCTYPE html>. Nothing else.`;
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
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildPrompt(type, style) },
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
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: buildPrompt(type, style) },
          ],
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
