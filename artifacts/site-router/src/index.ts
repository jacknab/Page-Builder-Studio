import express from "express";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { clientSitesTable } from "@workspace/db/schema";
import { eq, or } from "drizzle-orm";

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const CLIENTS_DIR = process.env.CLIENTS_DIR || "/var/www/clients";
const MAIN_DOMAIN = (process.env.MAIN_DOMAIN || "launchsite.certxa.com").toLowerCase();

function clientDir(id: number): string {
  return path.join(CLIENTS_DIR, String(id));
}

function serveClientSite(siteDir: string, urlPath: string, res: express.Response): void {
  if (!fs.existsSync(siteDir)) {
    res.status(404).send(notFoundPage("Site not found or not yet built."));
    return;
  }

  const safePath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(siteDir, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    const indexPath = path.join(siteDir, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(notFoundPage("Site not found or not yet built."));
    }
  }
}

function notFoundPage(message: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f1e8}
.box{text-align:center;padding:3rem;background:white;border-radius:1.5rem;box-shadow:0 4px 24px rgba(0,0,0,.08)}
h1{font-size:1.5rem;font-weight:900;color:#0f172a;margin:0 0 .5rem}p{color:#64748b;margin:0}</style>
</head><body><div class="box"><h1>🚀 Launchsite</h1><p>${message}</p></div></body></html>`;
}

async function resolveClientId(host: string): Promise<number | null> {
  const cleanHost = host.toLowerCase().replace(/:\d+$/, "");

  const subdomainSuffix = `.${MAIN_DOMAIN}`;
  if (cleanHost.endsWith(subdomainSuffix)) {
    const subdomain = cleanHost.slice(0, -subdomainSuffix.length);
    if (!subdomain) return null;

    const [site] = await db
      .select({ id: clientSitesTable.id })
      .from(clientSitesTable)
      .where(eq(clientSitesTable.subdomain, subdomain))
      .limit(1);

    return site?.id ?? null;
  }

  const [site] = await db
    .select({ id: clientSitesTable.id })
    .from(clientSitesTable)
    .where(eq(clientSitesTable.customDomain, cleanHost))
    .limit(1);

  return site?.id ?? null;
}

app.get("/preview/:clientId/*", async (req, res) => {
  const clientId = parseInt(req.params.clientId, 10);
  if (isNaN(clientId)) {
    res.status(400).send(notFoundPage("Invalid client ID."));
    return;
  }

  const urlPath = "/" + (req.params[0] || "");
  serveClientSite(clientDir(clientId), urlPath, res);
});

app.get("/preview/:clientId", async (req, res) => {
  const clientId = parseInt(req.params.clientId, 10);
  if (isNaN(clientId)) {
    res.status(400).send(notFoundPage("Invalid client ID."));
    return;
  }
  serveClientSite(clientDir(clientId), "/", res);
});

app.use(async (req, res) => {
  const host = req.headers.host || "";
  const clientId = await resolveClientId(host);

  if (!clientId) {
    res.status(404).send(notFoundPage("No site found for this domain."));
    return;
  }

  serveClientSite(clientDir(clientId), req.path, res);
});

app.listen(PORT, () => {
  console.log(`[site-router] Listening on port ${PORT}`);
  console.log(`[site-router] Serving client sites from: ${CLIENTS_DIR}`);
  console.log(`[site-router] Main domain: ${MAIN_DOMAIN}`);
});
