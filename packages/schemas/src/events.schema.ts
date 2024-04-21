import { relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { eventsToLabels } from './events-labels.schema'
import { selectLabelsSchema } from './labels.schema'
import { authUsers } from './users.schema'

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const insertEventsSchema = createInsertSchema(events, {
  description: z.string().min(1).max(1000),
  dueDate: z
    .string()
    .datetime()
    .nullable()
    .refine((value) => {
      if (value === null) return true
      return new Date(value).getTime() > Date.now()
    })
    .optional(),
  createdAt: z.string().datetime().nullable(),
})
  .required()
  .extend({ labels: z.array(z.coerce.number()).optional() })
  .omit({ id: true })

export type InsertEvent = z.infer<typeof insertEventsSchema>

export const selectEventsSchema = createSelectSchema(events, {
  id: z.coerce.string(),
  dueDate: z.date().nullable(),
  createdAt: z.date().nullable(),
})
  .required()
  .omit({ userId: true })
  .extend({
    labels: z.array(selectLabelsSchema),
  })

export type Event = z.infer<typeof selectEventsSchema>

export const eventsRelations = relations(events, ({ many }) => ({
  labels: many(eventsToLabels),
}))
