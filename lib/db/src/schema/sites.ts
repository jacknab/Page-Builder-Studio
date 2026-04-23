import { pgTable, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { plansTable } from "./plans";

export type SiteContent = {
  business?: {
    name?: string;
    tagline?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  services?: Array<{ name: string; price?: string; description?: string }>;
  hours?: Array<{ day: string; open?: string; close?: string; closed?: boolean }>;
  googleListingUrl?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
  };
  brand?: {
    primaryColor?: string;
    accentColor?: string;
  };
};

export const sitesTable = pgTable("sites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  planId: integer("plan_id")
    .notNull()
    .references(() => plansTable.id),
  slug: text("slug").notNull().unique(),
  customDomain: text("custom_domain").unique(),
  templateSlug: text("template_slug").notNull(),
  status: text("status").notNull().default("draft"),
  content: jsonb("content").$type<SiteContent>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Site = typeof sitesTable.$inferSelect;
export type InsertSite = typeof sitesTable.$inferInsert;
