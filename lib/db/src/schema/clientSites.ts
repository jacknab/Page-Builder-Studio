import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const clientSitesTable = pgTable("client_sites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),

  subdomain: text("subdomain").unique(),
  customDomain: text("custom_domain").unique(),

  // pending → site not built yet | building → in progress | live → site is up
  status: text("status").notNull().default("pending"),

  templateId: text("template_id"),
  businessType: text("business_type"),
  businessName: text("business_name"),
  tagline: text("tagline"),
  description: text("description"),
  phone: text("phone"),
  address: text("address"),

  servicesJson: text("services_json"),
  hoursJson: text("hours_json"),

  googleUrl: text("google_url"),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  tiktokUrl: text("tiktok_url"),
  yelpUrl: text("yelp_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientSiteSchema = createInsertSchema(clientSitesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClientSite = z.infer<typeof insertClientSiteSchema>;
export type ClientSite = typeof clientSitesTable.$inferSelect;
