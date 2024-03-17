import { db } from '@/src/lib/db'
import { and, eq } from 'drizzle-orm'
import { events, Event, selectEventsSchema, InsertEvent } from './events.schema'
import { pick } from 'remeda'
import { Repository } from '@/src/lib/repository'

type CreateSchema = Omit<InsertEvent, 'id' | 'createdAt'>

type UpdateSchema = {
  id: Event['id']
  userId: Event['userId']
} & Partial<Pick<InsertEvent, 'description' | 'dueDate'>>

type EventsRepository = Repository<Event, CreateSchema, UpdateSchema>

export const eventsRepository: EventsRepository = {
  async findAll({ userId }) {
    return db.query.events.findMany({
      where: eq(events.userId, userId),
    })
  },

  async findById({ userId, id }) {
    return db.query.events.findFirst({
      where: and(eq(events.userId, userId), eq(events.id, id)),
    })
  },

  async create({ userId, description, dueDate }) {
    return db
      .insert(events)
      .values({
        id: crypto.randomUUID(),
        description,
        userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning(pick(events, selectEventsSchema.keyof().options))
  },

  async update({ userId, id, description, dueDate }) {
    return db
      .update(events)
      .set({
        ...(description ? { description } : {}),
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .where(and(eq(events.id, id), eq(events.userId, userId)))
      .returning(pick(events, selectEventsSchema.keyof().options))
  },

  async delete({ userId, id }) {
    return db
      .delete(events)
      .where(and(eq(events.userId, userId), eq(events.id, id)))
      .returning({ deletedId: events.id })
  },
}
