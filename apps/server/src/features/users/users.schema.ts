import { relations } from 'drizzle-orm'
import { pgSchema } from 'drizzle-orm/pg-core'
import { uuid } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import z from 'zod'

// references auth schema managed by supabase
const auth = pgSchema('auth')

export const authUsers = auth.table('users', {
  id: uuid('id').primaryKey().notNull(),
  email: text('email').notNull(),
})

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  nickname: text('nickname'),
})

export type UsersTable = typeof users

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users).required()

export type User = z.infer<typeof selectUserSchema>

export const blocksRelations = relations(users, ({ one }) => ({
  user: one(authUsers, {
    fields: [users.id],
    references: [authUsers.id],
  }),
}))
