import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { events } from './events.schema'
import { labels } from './labels.schema'
import { relations } from 'drizzle-orm'

export const eventsToLabels = pgTable(
  'event_label',
  {
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    labelId: uuid('label_id')
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
