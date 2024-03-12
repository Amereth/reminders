import { DefaultError, useQuery } from '@tanstack/react-query'
import { Event } from '@schemas'

export const useEventsQuery = <TData = Event[]>(
  select?: (data: Event[]) => TData,
) =>
  useQuery<Event[], DefaultError, TData>({
    queryKey: ['/events?userId=1'],
    select,
  })
