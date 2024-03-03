import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable, serial } from "drizzle-orm/pg-core";

export const eventSchema = pgTable("events", {
  id: serial("id"),
  description: text("description"),
  date: timestamp("date"),
  createdAt: timestamp("created_at"),
});
