import { User } from '@reminders/schemas'
import z from 'zod'
import { Paginated } from '@reminders/utils'

export type WithUId = {
  userId: User['id']
}

export type WithId<T extends string | number> = {
  id: T
}

export type WithIdAndUId<T extends string | number = number> = WithId<T> &
  WithUId

export const paginatedArgsSchema = z.object({
  limit: z.coerce.number().optional().default(10),
  offset: z.coerce.number().default(0),
  from: z.string().datetime().default(new Date().toISOString()),
})

export const paginatedResponseSchema = z.object({
  total: z.number(),
  offset: z.number(),
  nextOffset: z.number().nullable(),
  limit: z.number(),
})

export type PaginatedArgs = z.infer<typeof paginatedArgsSchema>

export type FindMany<Return, Arg = WithUId> = (arg: Arg) => Promise<Return[]>

export type FindPaginated<Return, Arg = WithUId> = (
  arg: Arg & PaginatedArgs,
) => Promise<Paginated<Return[]>>

export type FindById<Return, Arg = WithIdAndUId> = (
  arg: Arg,
) => Promise<Return | undefined>

export type Create<Return, Arg = unknown> = (arg: Arg) => Promise<Return>

export type Update<Return, Arg = unknown> = (arg: Arg) => Promise<Return>

export type Delete<Return, Arg = WithIdAndUId> = (arg: Arg) => Promise<Return>
