import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, p);

const routes = [
  {
    url: "/",
    title: "Launchsite – Your business website, done for you",
    description:
      "Pick a template, answer a few questions about your business, and we launch your website. No editor. No design skills. Just a finished site.",
  },
  {
    url: "/how-it-works",
    title: "How It Works – Launchsite",
    description:
      "Three simple steps: choose a template, fill in our onboarding questionnaire, and we launch your website. No drag-and-drop. No learning curve.",
  },
  {
    url: "/templates",
    title: "Templates – Launchsite",
    description:
      "Browse professional website templates built for nail salons, hair salons, haircut studios, and barbershops. Pick one and we'll do the rest.",
  },
];

console.log("🔧 Running prerender…");

const { render } = await import(toAbs("./dist/server/entry-server.js"));
const template = await fs.readFile(toAbs("./dist/client/index.html"), "utf-8");

for (const route of routes) {
  const appHtml = render(route.url);

  const html = template
    .replace("<!--ssr-outlet-->", appHtml)
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      "<!--meta-description-->",
      `<meta name="description" content="${route.description}">`
    );

  const outDir =
    route.url === "/" ? toAbs("./dist/client") : toAbs(`./dist/client${route.url}`);

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "index.html"), html);
  console.log(`  ✓ ${route.url} → ${path.relative(__dirname, path.join(outDir, "index.html"))}`);
}

console.log("✅ Prerender complete. Static files in dist/client/");
