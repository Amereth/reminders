import { pgTable, primaryKey, serial } from 'drizzle-orm/pg-core'
import { events } from './events.schema'
import { labels } from './labels.schema'
import { relations } from 'drizzle-orm'

export const eventsToLabels = pgTable(
  'event_label',
  {
    eventId: serial('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),

    labelId: serial('label_id')
      .notNull()
      .references(() => labels.id, { onDelete: 'cascade' }),
  },

  (table) => ({
    pk: primaryKey({ columns: [table.eventId, table.labelId] }),
  }),
)

export const eventsToLabelsRelations = relations(eventsToLabels, ({ one }) => ({
  event: one(events, {
    fields: [eventsToLabels.eventId],
    references: [events.id],
  }),

  label: one(labels, {
    fields: [eventsToLabels.labelId],
    references: [labels.id],
  }),
}))
