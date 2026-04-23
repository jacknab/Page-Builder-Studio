import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const presetServicesTable = pgTable("preset_services", {
  id: serial("id").primaryKey(),
  businessType: text("business_type").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  name: text("name").notNull(),
  defaultPrice: text("default_price").notNull().default(""),
  defaultDescription: text("default_description").notNull().default(""),
  defaultDuration: text("default_duration").notNull().default(""),
  defaultCategory: text("default_category").notNull().default(""),
});

export const insertPresetServiceSchema = createInsertSchema(
  presetServicesTable,
).omit({ id: true });

export type InsertPresetService = z.infer<typeof insertPresetServiceSchema>;
export type PresetService = typeof presetServicesTable.$inferSelect;
