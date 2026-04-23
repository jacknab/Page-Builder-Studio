import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const plansTable = pgTable("plans", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull().default(0),
  allowsCustomDomain: boolean("allows_custom_domain").notNull().default(false),
  allowsDomainPurchase: boolean("allows_domain_purchase").notNull().default(false),
  maxSites: integer("max_sites").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Plan = typeof plansTable.$inferSelect;
