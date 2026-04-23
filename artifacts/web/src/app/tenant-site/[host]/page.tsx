import { notFound } from "next/navigation";
import { getSiteByDomain, getSiteBySlug } from "@/lib/sites";
import { renderTemplate } from "@/templates/registry";

export const dynamic = "force-dynamic";

export default async function TenantPage({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const decoded = decodeURIComponent(host).toLowerCase();
  const primary = (process.env.PRIMARY_HOST ?? "localhost").toLowerCase();

  let site = await getSiteByDomain(decoded);
  if (!site && decoded.endsWith(`.${primary}`)) {
    const sub = decoded.slice(0, decoded.length - primary.length - 1);
    site = await getSiteBySlug(sub);
  }

  if (!site || site.status !== "live") notFound();

  return renderTemplate(site.templateSlug, site.content);
}
