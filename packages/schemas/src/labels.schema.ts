import { relations } from 'drizzle-orm'
import { pgTable, serial, text, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { eventsToLabels } from './events-labels.schema'
import { authUsers } from './users.schema'

export const labels = pgTable('labels', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  description: text('description'),
  userId: uuid('user_id').references(() => authUsers.id, {
    onDelete: 'cascade',
  }),
})

export const insertLabelSchema = createInsertSchema(labels, {
  userId: z.string().uuid().nullable(),
  label: z.string().min(3).max(30),
  description: z.string().min(10).max(200).nullable(),
}).required()

export type InsertLabel = z.infer<typeof insertLabelSchema>

export const labelFullSchema = createSelectSchema(labels)

export type LabelFull = z.infer<typeof labelFullSchema>

export const labelSchema = labelFullSchema
  .omit({ userId: true })
  .extend({ id: z.coerce.string() })

export type Label = z.infer<typeof labelSchema>

export const labelsRelations = relations(labels, ({ many }) => ({
  events: many(eventsToLabels),
}))
