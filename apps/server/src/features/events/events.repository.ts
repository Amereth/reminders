import { db } from '@/lib/db'
import { and, count, eq, gte, isNull, or } from 'drizzle-orm'
import {
  events,
  Event,
  InsertEvent,
  User,
  eventsToLabels,
  insertEventSchema,
  eventSchema,
  Label,
} from '@reminders/schemas'
import {
  Create,
  Delete,
  FindById,
  Update,
  FindPaginated,
  WithId,
  WithUId,
} from '@/lib/repository'
import { differenceWith, isDeepEqual } from 'remeda'
import z from 'zod'
import createHttpError from 'http-errors'

type CreateSchema = Omit<InsertEvent, 'id' | 'createdAt'>

type DBEventResponse = Omit<Event, 'labels'> & {
  labels: { label: Label }[]
}

const mapToEvent = (event: DBEventResponse): Event => ({
  ...event,
  labels: event.labels.map(({ label }) => label),
})

export const updateSchema = insertEventSchema
  .pick({ description: true, dueDate: true, labels: true })
  .partial()

type UpdateSchema = {
  id: number
  userId: User['id']
} & z.infer<typeof updateSchema>

type EventsRepository = {
  findPaginated: FindPaginated<Event, WithUId & { from: string }>
  findById: FindById<Event>
  create: Create<Event, CreateSchema>
  update: Update<Event, UpdateSchema>
  delete: Delete<WithId<string>>
}

export const eventsRepo: EventsRepository = {
  async findPaginated({ userId, offset, limit, from }) {
    const dbResp = await db.query.events.findMany({
      where: and(
        eq(events.userId, userId),
        or(gte(events.dueDate, new Date(from)), isNull(events.dueDate)),
      ),
      with: {
        labels: {
          with: { label: true },
          columns: { eventId: false, labelId: false },
        },
      },
      limit,
      offset,
    })

    const { total } = (
      await db
        .select({ total: count() })
        .from(events)
        .where(eq(events.userId, userId))
    )[0]

    return {
      // @ts-expect-error
      data: z.array(eventSchema).parse(dbResp.map(mapToEvent)),
      total,
      offset,
      nextOffset: offset + limit >= total ? null : offset + limit,
      limit,
    }
  },

  async findById({ userId, id: eventId }) {
    const dbResp = (await db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.userId, userId)),
      with: {
        labels: {
          with: { label: true },
          columns: { eventId: false, labelId: false },
        },
      },
    })) as DBEventResponse | undefined

    if (!dbResp) throw createHttpError(404, 'Event not found')

    return eventSchema.parse(mapToEvent(dbResp))
  },

  async create({ userId, description, dueDate, labels }) {
    const id = await db.transaction(async (tx) => {
      const [{ id }] = await tx
        .insert(events)
        .values({
          description,
          userId,
          dueDate: dueDate ? new Date(dueDate) : null,
        })
        .returning({ id: events.id })

      if (labels?.length) {
        await Promise.all(
          labels.map((labelId) =>
            tx.insert(eventsToLabels).values({ eventId: id, labelId }),
          ),
        )
      }

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

    return { id: eventId.toString() }
  },
}
