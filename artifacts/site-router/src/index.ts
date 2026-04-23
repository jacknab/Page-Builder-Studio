import express from "express";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { clientSitesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const MAIN_DOMAIN = (process.env.MAIN_DOMAIN || "launchsite.certxa.com").toLowerCase();
const TEMPLATE_DIST = process.env.TEMPLATE_DIST || path.join(process.cwd(), "artifacts/nail-salon-template/dist");

function notFoundPage(message: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f1e8}
.box{text-align:center;padding:3rem;background:white;border-radius:1.5rem;box-shadow:0 4px 24px rgba(0,0,0,.08)}
h1{font-size:1.5rem;font-weight:900;color:#0f172a;margin:0 0 .5rem}p{color:#64748b;margin:0}</style>
</head><body><div class="box"><h1>🚀 Launchsite</h1><p>${message}</p></div></body></html>`;
}

function serveTemplateSPA(urlPath: string, res: express.Response): void {
  if (!fs.existsSync(TEMPLATE_DIST)) {
    res.status(503).send(notFoundPage("Template not yet built. Run deploy.sh first."));
    return;
  }

  const safePath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(TEMPLATE_DIST, safePath);

  // Serve the exact static file if it exists (JS, CSS, images, etc.)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(path.resolve(filePath));
    return;
  }

  // SPA fallback — always serve index.html so the React app can route
  const indexPath = path.join(TEMPLATE_DIST, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(path.resolve(indexPath));
  } else {
    res.status(503).send(notFoundPage("Template not yet built. Run deploy.sh first."));
  }
}

async function clientExistsForHost(host: string): Promise<boolean> {
  const cleanHost = host.toLowerCase().replace(/:\d+$/, "");

  const subdomainSuffix = `.${MAIN_DOMAIN}`;
  if (cleanHost.endsWith(subdomainSuffix)) {
    const subdomain = cleanHost.slice(0, -subdomainSuffix.length);
    if (!subdomain) return false;

    const [site] = await db
      .select({ id: clientSitesTable.id })
      .from(clientSitesTable)
      .where(eq(clientSitesTable.subdomain, subdomain))
      .limit(1);

    return !!site;
  }

  // Custom domain lookup
  const [site] = await db
    .select({ id: clientSitesTable.id })
    .from(clientSitesTable)
    .where(eq(clientSitesTable.customDomain, cleanHost))
    .limit(1);

  return !!site;
}

// Catch-all: check DB then serve the template SPA
app.use(async (req, res) => {
  const host = req.headers.host || "";

  const exists = await clientExistsForHost(host);
  if (!exists) {
    res.status(404).send(notFoundPage("No site found for this domain."));
    return;
  }

  serveTemplateSPA(req.path, res);
});

app.listen(PORT, () => {
  console.log(`[site-router] Listening on port ${PORT}`);
  console.log(`[site-router] Main domain: ${MAIN_DOMAIN}`);
  console.log(`[site-router] Template dist: ${TEMPLATE_DIST}`);
});
