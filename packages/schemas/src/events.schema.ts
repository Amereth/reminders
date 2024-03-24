import { timestamp } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { uuid } from 'drizzle-orm/pg-core'
import { authUsers } from './users.schema'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Schema for inserting a user - can be used to validate API requests
export const insertEventsSchema = createInsertSchema(events, {
  description: z.string().min(1).max(1000),
  dueDate: z
    .string()
    .datetime()
    .nullable()
    .refine((value) => {
      if (value === null) return true
      return new Date(value).getTime() > Date.now()
    }),
  createdAt: z.string().datetime().nullable(),
}).required()

export type InsertEvent = z.infer<typeof insertEventsSchema>

// Schema for selecting a user - can be used to validate API responses
export const selectEventsSchema = createSelectSchema(events, {
  dueDate: z.date().nullable(),
  createdAt: z.date().nullable(),
}).required()

export type Event = z.infer<typeof selectEventsSchema>
