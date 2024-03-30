import { DefaultError } from '@tanstack/react-query'
import { Event } from '@reminders/schemas'
import {
  authQueryOptions,
  useAuthenticatedQuery,
} from '../../useAuthenticatedQuery'

export const eventsQueryKey = ['/events'] as const

export const eventsQueryOptions = authQueryOptions<Event[]>({
  queryKey: eventsQueryKey,
})

export const useEventsQuery = <TData = Event[]>(
  select?: (data: Event[]) => TData,
) =>
  useAuthenticatedQuery<Event[], DefaultError, TData>({
    queryKey: eventsQueryKey,
    select,
  })
