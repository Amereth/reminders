import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema for inserting a user - can be used to validate API requests
export const insertEventsSchema = createInsertSchema(events, {
  dueDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime().nullable(),
}).required();

// Schema for selecting a user - can be used to validate API responses
export const selectEventsSchema = createSelectSchema(events, {
  dueDate: z.date().nullable(),
  createdAt: z.date().nullable(),
}).required();
