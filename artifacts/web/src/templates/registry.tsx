import type { ComponentType } from "react";
import type { SiteContent } from "@workspace/db/schema";
import { ModernServicesTemplate } from "./modern-services";
import { LuxurySalonTemplate } from "./luxury-salon";

export type TemplateMeta = {
  slug: string;
  name: string;
  category: string;
  description: string;
  preview: { bg: string; accent: string; label: string };
};

export type TemplateProps = {
  content: SiteContent;
};

export type TemplateEntry = TemplateMeta & {
  Component: ComponentType<TemplateProps>;
};

export const TEMPLATES: TemplateEntry[] = [
  {
    slug: "modern-services",
    name: "Modern Services",
    category: "Services business",
    description:
      "Clean, single-column landing for service businesses with services, hours, and a contact section.",
    preview: { bg: "from-slate-900 to-slate-700", accent: "bg-blue-500", label: "Modern" },
    Component: ModernServicesTemplate,
  },
  {
    slug: "luxury-salon",
    name: "Luxury Salon",
    category: "Beauty & wellness",
    description:
      "Elegant, dark editorial layout with gold accents — built for salons, spas, and boutique studios.",
    preview: { bg: "from-stone-900 to-amber-900", accent: "bg-amber-400", label: "Luxury" },
    Component: LuxurySalonTemplate,
  },
];

export function getTemplate(slug: string): TemplateEntry | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplateMetas(): TemplateMeta[] {
  return TEMPLATES.map(({ Component: _C, ...meta }) => meta);
}

export function renderTemplate(slug: string, content: SiteContent) {
  const entry = getTemplate(slug) ?? TEMPLATES[0];
  const Comp = entry.Component;
  return <Comp content={content} />;
}
