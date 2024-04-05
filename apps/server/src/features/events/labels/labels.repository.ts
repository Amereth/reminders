import { db } from '@/lib/db'
import { and, eq, isNull, or } from 'drizzle-orm'
import {
  labels,
  Label,
  selectLabelsSchema,
  InsertLabel,
} from '@reminders/schemas'
import { pick } from 'remeda'
import {
  Create,
  Delete,
  FindAll,
  WithId,
  WithIdAndUId,
  WithUId,
  Update,
  FindByUserId,
} from '@/lib/repository'

type CreateSchema = Omit<InsertLabel, 'id' | 'createdAt'>

type UpdateSchema = WithIdAndUId & {
  label?: Label['label']
  description?: Label['description']
}

type LabelsRepository = {
  findAll: FindAll<Label[], WithUId>
  findUsersLabels: FindByUserId<Label[], WithUId>
  create: Create<Label[], CreateSchema>
  update: Update<Label[], UpdateSchema>
  delete: Delete<WithId[], WithIdAndUId>
}

export const labelsRepository: LabelsRepository = {
  async findAll({ userId }) {
    return db.query.labels.findMany({
      where: or(eq(labels.userId, userId), isNull(labels.userId)),
    })
  },

  async findUsersLabels({ userId }) {
    return db.query.labels.findMany({
      where: and(eq(labels.userId, userId)),
    })
  },

  async create(data) {
    return db
      .insert(labels)
      .values({
        id: crypto.randomUUID(),
        ...data,
      })
      .returning(pick(labels, selectLabelsSchema.keyof().options))
  },

  async update({ userId, id, description, label }) {
    return db
      .update(labels)
      .set({
        label,
        ...(description ? { description } : {}),
      })
      .where(and(eq(labels.id, id), eq(labels.userId, userId ?? '')))
      .returning(pick(labels, selectLabelsSchema.keyof().options))
  },

  async delete({ userId, id }) {
    return db
      .delete(labels)
      .where(and(eq(labels.userId, userId), eq(labels.id, id)))
      .returning({ id: labels.id })
  },
}
