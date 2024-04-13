import { DefaultError } from '@tanstack/react-query'
import { Label } from '@reminders/schemas'
import { authQueryOptions, useAuthQuery } from '@/hooks/use-auth-query'
import keys from '@query-keys'

type Select<TData> = (data: Label[]) => TData

export const eventLabelsQueryOptions = <TData = Label[]>(
  select?: Select<TData>,
) =>
  authQueryOptions<Label[], DefaultError, TData>({
    queryKey: keys.eventLabels,
    select,
  })

export const useEventLabelsQuery = <TData = Label[]>(select?: Select<TData>) =>
  useAuthQuery(eventLabelsQueryOptions(select))
