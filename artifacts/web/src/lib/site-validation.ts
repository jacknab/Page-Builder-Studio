import { z } from "zod";
import { TEMPLATES } from "@/templates/registry";

const templateSlugs = TEMPLATES.map((t) => t.slug) as [string, ...string[]];

export const siteContentSchema = z.object({
  business: z
    .object({
      name: z.string().max(120).optional(),
      tagline: z.string().max(200).optional(),
      description: z.string().max(2000).optional(),
      address: z.string().max(200).optional(),
      phone: z.string().max(40).optional(),
      email: z.string().email().optional().or(z.literal("")),
    })
    .optional(),
  services: z
    .array(
      z.object({
        name: z.string().max(120),
        price: z.string().max(40).optional(),
        description: z.string().max(500).optional(),
      }),
    )
    .max(50)
    .optional(),
  hours: z
    .array(
      z.object({
        day: z.string().max(20),
        open: z.string().max(20).optional(),
        close: z.string().max(20).optional(),
        closed: z.boolean().optional(),
      }),
    )
    .max(14)
    .optional(),
  googleListingUrl: z.string().url().optional().or(z.literal("")),
  social: z
    .object({
      instagram: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      tiktok: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      youtube: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  brand: z
    .object({
      primaryColor: z.string().max(20).optional(),
      accentColor: z.string().max(20).optional(),
    })
    .optional(),
});

export const onboardingSchema = z.object({
  templateSlug: z.enum(templateSlugs),
  content: siteContentSchema,
});

export const updateContentSchema = siteContentSchema;

export const updateTemplateSchema = z.object({
  templateSlug: z.enum(templateSlugs),
});

const domainPattern =
  /^(?=.{1,253}$)(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i;

export const updateDomainSchema = z.object({
  customDomain: z
    .string()
    .trim()
    .toLowerCase()
    .regex(domainPattern, "Enter a valid domain (e.g. example.com)")
    .nullable()
    .or(z.literal("").transform(() => null)),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
