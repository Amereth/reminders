import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { events } from './events.schema'
import { labels } from './labels.schema'

export const events_labels = pgTable(
  'event_label',
  {
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    labelId: uuid('user_id')
      .notNull()
      .references(() => labels.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.eventId, table.labelId] }),
  }),
)
