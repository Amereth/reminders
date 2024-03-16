import { timestamp } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { uuid } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().notNull(),
  userId: uuid('user_id').notNull(),
  description: text('description').notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Schema for inserting a user - can be used to validate API requests
export const insertEventsSchema = createInsertSchema(events, {
  dueDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime().nullable(),
}).required()

// Schema for selecting a user - can be used to validate API responses
export const selectEventsSchema = createSelectSchema(events, {
  dueDate: z.date().nullable(),
  createdAt: z.date().nullable(),
}).required()

export type Event = z.infer<typeof selectEventsSchema>
