import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { eventsToLabels } from './events-labels.schema'
import { authUsers } from './users.schema'

export const labels = pgTable('labels', {
  id: uuid('id').primaryKey(),
  label: text('label').notNull(),
  description: text('description'),
  userId: uuid('user_id').references(() => authUsers.id, {
    onDelete: 'cascade',
  }),
})

export const insertLabelsSchema = createInsertSchema(labels, {
  userId: z.string().uuid().nullable(),
  label: z.string().min(3).max(30),
  description: z.string().min(10).max(200).nullable(),
}).required()

export type InsertLabel = z.infer<typeof insertLabelsSchema>

export const selectLabelsFullSchema = createSelectSchema(labels)

export type LabelFull = z.infer<typeof selectLabelsSchema>

export const selectLabelsSchema = selectLabelsFullSchema.omit({
  userId: true,
})

export type Label = z.infer<typeof selectLabelsSchema>

export const labelsRelations = relations(labels, ({ many }) => ({
  events: many(eventsToLabels),
}))
