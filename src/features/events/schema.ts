import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey().notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema for inserting a user - can be used to validate API requests
export const insertEventsSchema = createInsertSchema(events, {
  dueDate: z.string().datetime(),
  createdAt: z.string().datetime(),
});

// Schema for selecting a user - can be used to validate API responses
export const selectEventsSchema = createSelectSchema(events);
