import { db } from '@/src/lib/db'
import { and, eq } from 'drizzle-orm'
import { events, Event, selectEventsSchema, InsertEvent } from './events.schema'
import { pick } from 'remeda'

type EventsRepository = {
  findAll: (args: { userId: Event['userId'] }) => Promise<Event[]>

  findById: (args: {
    userId: Event['userId']
    id: Event['id']
  }) => Promise<Event | undefined>

  create: (args: Omit<InsertEvent, 'id' | 'createdAt'>) => Promise<Event[]>

  update: (
    args: {
      id: Event['id']
      userId: Event['userId']
    } & Partial<Pick<InsertEvent, 'description' | 'dueDate'>>,
  ) => Promise<Event[]>

  delete: (args: {
    userId: Event['userId']
    id: Event['id']
  }) => Promise<{ deletedId: string }[]>
}

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
