import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { authUsers } from './users.schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const labels = pgTable('labels', {
  id: uuid('id').primaryKey().notNull(),
  label: text('label').notNull(),
  description: text('description'),
  userId: uuid('user_id').references(() => authUsers.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const insertLabelsSchema = createInsertSchema(labels, {
  userId: z.string().uuid().nullable(),
  label: z.string().min(3).max(30),
  description: z.string().min(10).max(200).nullable(),
  createdAt: z.string().datetime().nullable(),
}).required()

export type InsertLabel = z.infer<typeof insertLabelsSchema>

export const selectLabelsSchema = createSelectSchema(labels)

export type Label = z.infer<typeof selectLabelsSchema>
