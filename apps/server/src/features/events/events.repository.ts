import { db } from '@/lib/db'
import { and, eq } from 'drizzle-orm'
import { events, Event, InsertEvent, User, Label } from '@reminders/schemas'
import {
  Create,
  Delete,
  FindAll,
  FindById,
  WithId,
  WithIdAndUId,
  WithUId,
  Update,
} from '@/lib/repository'
import { Maybe } from '@reminders/utils'

type DBEventResponse = Omit<Event, 'labels'> & {
  labels: { label: Label }[]
}

const mapToEvent = (event: DBEventResponse): Event => ({
  ...event,
  labels: event.labels.map(({ label }) => label),
})

type CreateSchema = Omit<InsertEvent, 'id' | 'createdAt'>

type UpdateSchema = {
  id: Event['id']
  userId: User['id']
} & Partial<Pick<InsertEvent, 'description' | 'dueDate'>>

type EventsRepository = {
  findAll: FindAll<Event[], WithUId>
  findById: FindById<Maybe<Event>, WithIdAndUId>
  create: Create<Event, CreateSchema>
  update: Update<Event, UpdateSchema>
  delete: Delete<WithId, WithIdAndUId>
}

export const eventsRepository: EventsRepository = {
  async findAll({ userId }) {
    const dbResponse = await db.query.events.findMany({
      where: eq(events.userId, userId),
      with: {
        labels: {
          with: {
            label: true,
          },
          columns: {
            eventId: false,
            labelId: false,
          },
        },
      },
    })

    return dbResponse.map(mapToEvent)
  },

  async findById({ userId, id: eventId }) {
    const event = await db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.userId, userId)),
      with: {
        labels: {
          with: {
            label: true,
          },
          columns: {
            eventId: false,
            labelId: false,
          },
        },
      },
    })

    if (event) {
      return mapToEvent(event)
    }
  },

  async create({ userId, description, dueDate }) {
    const event = await db
      .insert(events)
      .values({
        id: crypto.randomUUID(),
        description,
        userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning({ id: events.id })

    return this.findById({ userId, id: event[0].id }) as Promise<Event>
  },

  async update({ userId, id, description, dueDate }) {
    const event = await db
      .update(events)
      .set({
        ...(description ? { description } : {}),
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .where(and(eq(events.id, id), eq(events.userId, userId)))
      .returning({ id: events.id })

    return this.findById({ userId, id: event[0].id }) as Promise<Event>
  },

  async delete({ userId, id }) {
    const response = await db
      .delete(events)
      .where(and(eq(events.userId, userId), eq(events.id, id)))
      .returning({ id: events.id })

    return response[0]
  },
}
