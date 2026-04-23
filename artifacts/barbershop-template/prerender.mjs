/**
 * Static site generator for the barbershop template.
 *
 * Usage (normally called by the launch script, not directly):
 *   node prerender.mjs
 *
 * Reads:  dist/server/entry-server.js  (SSR bundle)
 *         dist/client/index.html       (Vite client build)
 *         src/client-data.json         (client business data)
 * Writes: dist/client/index.html       (final prerendered HTML)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, p);

console.log("Prerendering barbershop template…");

const { render } = await import(toAbs("./dist/server/entry-server.js"));
const template = await fs.readFile(toAbs("./dist/client/index.html"), "utf-8");
const clientData = JSON.parse(
  await fs.readFile(toAbs("./src/client-data.json"), "utf-8")
);

const appHtml = render();

const pageTitle = `${clientData.businessName} – ${clientData.tagline}`;
const pageDescription = clientData.description
  ? clientData.description.slice(0, 160)
  : `${clientData.businessName} – ${clientData.tagline}`;

const html = template
  .replace("<!--ssr-outlet-->", appHtml)
  .replace("<!--page-title-->", pageTitle)
  .replace(
    "<!--meta-description-->",
    `<meta name="description" content="${pageDescription.replace(/"/g, "&quot;")}">`
  );

await fs.writeFile(toAbs("./dist/client/index.html"), html);
console.log("Prerender complete → dist/client/index.html");
