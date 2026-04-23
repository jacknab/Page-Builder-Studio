import { NextRequest, NextResponse } from "next/server";

const PASSTHROUGH_PREFIXES = ["/_next", "/favicon", "/api", "/admin", "/dashboard", "/onboarding", "/login", "/signup", "/forgot-password", "/reset-password", "/templates"];

function isAppHost(host: string, primary: string): boolean {
  if (host === primary) return true;
  if (host.endsWith(`.${primary}`)) {
    const sub = host.slice(0, host.length - primary.length - 1);
    if (sub === "www") return true;
  }
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const primary = (process.env.PRIMARY_HOST ?? "localhost").toLowerCase();

  if (PASSTHROUGH_PREFIXES.some((p) => url.pathname === p || url.pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  if (isAppHost(host, primary) || host === "localhost" || host.endsWith(".replit.dev") || host.endsWith(".repl.co")) {
    return NextResponse.next();
  }

  // Tenant request — rewrite to /_site/[host] handler
  if (!url.pathname.startsWith("/tenant-site/")) {
    const rewriteUrl = url.clone();
    rewriteUrl.pathname = `/tenant-site/${host}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
