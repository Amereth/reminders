import { db } from '@/lib/db'
import { and, eq, isNull, or } from 'drizzle-orm'
import { labels, Label, labelSchema, InsertLabel } from '@reminders/schemas'
import { pick } from 'remeda'
import {
  Create,
  Delete,
  FindMany,
  WithId,
  WithIdAndUId,
  Update,
} from '@/lib/repository'
import z from 'zod'

type CreateSchema = Omit<InsertLabel, 'id' | 'createdAt'>

type UpdateSchema = WithIdAndUId & {
  label?: Label['label']
  description?: Label['description']
}

type LabelsRepository = {
  findAll: FindMany<Label>
  findUsersLabels: FindMany<Label>
  create: Create<Label, CreateSchema>
  update: Update<Label, UpdateSchema>
  delete: Delete<WithId<string>>
}

export const labelsRepo: LabelsRepository = {
  async findAll({ userId }) {
    const resp = await db.query.labels.findMany({
      where: or(eq(labels.userId, userId), isNull(labels.userId)),
    })

    return z.array(labelSchema).parse(resp)
  },

  async findUsersLabels({ userId }) {
    const resp = db.query.labels.findMany({
      where: and(eq(labels.userId, userId)),
    })

    return z.array(labelSchema).parse(resp)
  },

  async create(data) {
    const resp = await db
      .insert(labels)
      .values(data)
      .returning(pick(labels, labelSchema.keyof().options))

    return labelSchema.parse(resp)
  },

  async update({ userId, id, description, label }) {
    const resp = await db
      .update(labels)
      .set({
        label,
        ...(description ? { description } : {}),
      })
      .where(and(eq(labels.id, id), eq(labels.userId, userId ?? '')))
      .returning(pick(labels, labelSchema.keyof().options))

    return labelSchema.parse(resp)
  },

  async delete({ userId, id }) {
    const resp = await db
      .delete(labels)
      .where(and(eq(labels.userId, userId), eq(labels.id, id)))
      .returning({ id: labels.id })

    return z.object({ id: z.string() }).parse(resp[0])
  },
}
