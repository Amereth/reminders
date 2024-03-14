import { DefaultError } from '@tanstack/react-query'
import { Event } from '@schemas'
import { useAuthenticatedQuery } from '../useAuthenticatedQuery'

export const eventsQueryKey = ['/events'] as const

export const useEventsQuery = <TData = Event[]>(
  select?: (data: Event[]) => TData,
) =>
  useAuthenticatedQuery<Event[], DefaultError, TData>({
    queryKey: eventsQueryKey,
    select,
  })
