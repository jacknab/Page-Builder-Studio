import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { default: OpenAI } = await import(
  "/home/runner/workspace/node_modules/.pnpm/openai@6.34.0_zod@4.3.6/node_modules/openai/index.mjs"
);

const client = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

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
* Descriptive alt text for all images (MUST describe nail salon context)
* Include location + service context naturally

# IMAGE RULES (NON-NEGOTIABLE)
* Use ONLY the image URLs provided in the user message
* NEVER invent image URLs or use picsum.photos or placeholder services
* Every <img> tag must have alt text describing the nail salon context

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

const STYLE_PALETTE = {
  luxury: "Color palette: deep navy (#0a0a1a), champagne gold (#c9a96e), ivory (#faf8f3). Mood: high-end, exclusive. Use serif headings.",
  modern: "Color palette: white (#fff), electric indigo (#4f46e5), slate (#1e293b). Mood: confident, tech-forward. Use bold sans-serif.",
  minimal: "Color palette: warm off-white (#fafaf8), charcoal (#222), dusty rose (#c4a5a0). Mood: refined restraint, gallery-like. Use thin-weight sans-serif.",
  bold: "Color palette: near-black (#0f0f0f), hot coral (#ff4d4d), electric lime (#ccff00). Mood: unapologetic, editorial, high-energy. Use heavy black-weight display type.",
};

const LAYOUT_VARIANTS = [
  "Split-screen hero: left half is a full-height nail salon image, right half is business name, tagline, and CTA. Remaining sections alternate left-image/right-text.",
  "Editorial magazine layout: large asymmetric hero with headline overlapping a background image, followed by a masonry-style service grid, then a testimonial strip, then contact.",
  "Full-bleed image hero at 100vh with an overlapping white content card floating above the next section. Use a diagonal clip-path transition between sections.",
  "Centered typographic hero (no image, just large bold text) followed by image-heavy service strips (each service is a full-width cinematic band), then a split contact section.",
  "Offset hero: business name large on left, full-height image on right. Services in a horizontal scroll strip below. Gallery as a CSS-grid mosaic. About in a split layout.",
  "Layered hero: full-bleed background image with frosted-glass card overlay containing the headline and CTA. Services in a tight editorial grid. Gallery in a creative mosaic.",
];

function buildUserPrompt(type, style, layoutIndex) {
  const palette = STYLE_PALETTE[style] ?? STYLE_PALETTE.modern;
  const layout = LAYOUT_VARIANTS[layoutIndex % LAYOUT_VARIANTS.length];
  const imgs = NAIL_IMAGES;

  return `Generate a single-page HTML website for a ${type.replace(/-/g, " ")} business.

STYLE: ${style}
${palette}

LAYOUT INSTRUCTION: ${layout}

IMAGE RULES (NON-NEGOTIABLE — use ONLY these URLs, no others):

Hero section — pick ONE:
${imgs.hero.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Services section — use 1–2 of these:
${imgs.services.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Gallery section — use ALL 6 in a creative (non-uniform) layout:
${imgs.gallery.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

About section — pick ONE:
${imgs.about.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Contact section — pick ONE:
${imgs.contact.map((u, i) => `  ${i + 1}. ${u}`).join("\n")}

Every <img> tag must have alt text describing the nail salon context (e.g., "gel manicure close-up", "luxury nail salon interior").
Include a realistic business name, phone number, address, and service descriptions.
Output only the complete HTML document starting with <!DOCTYPE html>. Nothing else.`;
}

const outDir = path.join(__dirname, "..", "generated-templates");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  { type: "nail-salon", style: "luxury",  layoutIndex: 0 },
  { type: "nail-salon", style: "modern",  layoutIndex: 1 },
  { type: "nail-salon", style: "minimal", layoutIndex: 2 },
  { type: "nail-salon", style: "bold",    layoutIndex: 3 },
];

console.log(`Generating ${jobs.length} nail salon templates...\n`);

for (let i = 0; i < jobs.length; i++) {
  const { type, style, layoutIndex } = jobs[i];
  const filename = `nail-salon-${style}.html`;
  const outPath = path.join(outDir, filename);

  process.stdout.write(`[${i + 1}/${jobs.length}] ${style.padEnd(8)} — generating...`);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildUserPrompt(type, style, layoutIndex) },
      ],
    });

    let html = response.choices[0]?.message?.content ?? "";
    html = html.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim();

    if (!html.toLowerCase().startsWith("<!doctype") && !html.startsWith("<html")) {
      throw new Error("Response does not appear to be valid HTML");
    }

    fs.writeFileSync(outPath, html, "utf8");
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(` ✓  ${filename} (${kb} KB)`);
  } catch (err) {
    console.log(` ✗  FAILED: ${err.message}`);
  }
}

console.log("\n--- Generated files ---");
fs.readdirSync(outDir).sort().forEach(f => {
  const size = Math.round(fs.statSync(path.join(outDir, f)).size / 1024);
  console.log(`  ${f}  (${size} KB)`);
});
