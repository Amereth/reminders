import { User } from '@reminders/schemas'

export type WithUId = {
  userId: User['id']
}

export type WithId = {
  id: string
}

export type WithIdAndUId = WithId & WithUId

export type FindAll<Return, Arg = WithUId> = (arg: Arg) => Promise<Return>

export type FindById<Return, Arg = WithId> = (arg: Arg) => Promise<Return>

export type FindByUserId<Return, Arg = WithUId> = (arg: Arg) => Promise<Return>

export type Create<Return, Arg = unknown> = (arg: Arg) => Promise<Return>

export type Update<Return, Arg = unknown> = (arg: Arg) => Promise<Return>

export type Delete<Return, Arg = WithIdAndUId> = (arg: Arg) => Promise<Return>
