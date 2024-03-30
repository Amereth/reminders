import { User } from '@reminders/schemas'

interface WithUserId {
  userId: User['id']
}

interface WithId extends WithUserId {
  id: string
}

export type Repository<
  SelectSchema,
  CreateSchema extends WithUserId,
  UpdateSchema extends WithUserId,
> = {
  findAll: (args: WithUserId) => Promise<SelectSchema[]>

  findById: (args: WithId) => Promise<SelectSchema | undefined>

  create: (args: CreateSchema) => Promise<SelectSchema[]>

  update: (args: UpdateSchema) => Promise<SelectSchema[]>

  delete: (args: WithId) => Promise<{ deletedId: string }[]>
}
