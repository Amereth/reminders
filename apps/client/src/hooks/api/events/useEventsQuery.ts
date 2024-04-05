import { DefaultError } from '@tanstack/react-query'
import { Event } from '@reminders/schemas'
import {
  authQueryOptions,
  useAuthenticatedQuery,
} from '../../useAuthenticatedQuery'
import keys from '@keys'

type Select<TData> = (data: Event[]) => TData

export const eventsQueryOptions = <TData = Event[]>(select?: Select<TData>) =>
  authQueryOptions<Event[], DefaultError, TData>({
    queryKey: keys.events,
    select,
  })

export const useEventsQuery = <TData = Event[]>(select?: Select<TData>) =>
  useAuthenticatedQuery<Event[], DefaultError, TData>(
    eventsQueryOptions(select),
  )
