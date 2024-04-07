import { db } from '@/lib/db'
import { and, eq } from 'drizzle-orm'
import {
  events,
  Event,
  InsertEvent,
  User,
  Label,
  eventsToLabels,
  insertEventsSchema,
} from '@reminders/schemas'
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
import { differenceWith, isDeepEqual } from 'remeda'
import z from 'zod'

type DBEventResponse = Omit<Event, 'labels'> & {
  labels: { label: Label }[]
}

const mapToEvent = (event: DBEventResponse): Event => ({
  ...event,
  labels: event.labels.map(({ label }) => label),
})

type CreateSchema = Omit<InsertEvent, 'id' | 'createdAt'>

export const updateSchema = insertEventsSchema
  .pick({ description: true, dueDate: true, labels: true })
  .partial()

type UpdateSchema = {
  id: Event['id']
  userId: User['id']
} & z.infer<typeof updateSchema>

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

  async create({ userId, description, dueDate, labels }) {
    const id = await db.transaction(async (tx) => {
      const [{ id }] = await tx
        .insert(events)
        .values({
          id: crypto.randomUUID(),
          description,
          userId,
          dueDate: dueDate ? new Date(dueDate) : null,
        })
        .returning({ id: events.id })

      await Promise.all(
        labels.map((labelId) =>
          tx.insert(eventsToLabels).values({ eventId: id, labelId }),
        ),
      )

      return id
    })

    return this.findById({ userId, id }) as Promise<Event>
  },

  async update({ userId, id, description, dueDate, labels }) {
    const eventId = await db.transaction(async (tx) => {
      const [{ id: eventId }] = await tx
        .update(events)
        .set({
          ...(description ? { description } : {}),
          dueDate: dueDate ? new Date(dueDate) : null,
        })
        .where(and(eq(events.id, id), eq(events.userId, userId)))
        .returning({ id: events.id })

      if (labels) {
        const existingLabels = await tx.query.eventsToLabels.findMany({
          where: eq(eventsToLabels.eventId, eventId),
        })

        const labelsToInsert = differenceWith(
          labels,
          existingLabels.map((l) => l.labelId),
          isDeepEqual,
        )

        const labelsToDelete = differenceWith(
          existingLabels.map((l) => l.labelId),
          labels,
          isDeepEqual,
        )

        await Promise.all(
          labelsToInsert.map((labelId) =>
            tx.insert(eventsToLabels).values({ eventId, labelId }),
          ),
        )

        await Promise.all(
          labelsToDelete.map((labelId) =>
            tx
              .delete(eventsToLabels)
              .where(eq(eventsToLabels.labelId, labelId)),
          ),
        )
      }

      return eventId
    })

    return this.findById({ userId, id: eventId }) as Promise<Event>
  },

  async delete({ userId, id }) {
    const [eventId] = await db
      .delete(events)
      .where(and(eq(events.userId, userId), eq(events.id, id)))
      .returning({ id: events.id })

    return eventId
  },
}
