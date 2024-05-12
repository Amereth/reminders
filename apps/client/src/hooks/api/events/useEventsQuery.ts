import { Event } from '@reminders/schemas'
import keys from '@query-keys'
import {
  PaginatedQueryOpts,
  authInifiniteQueryOptions,
  useAuthInfiniteQuery,
} from '@/hooks/use-auth-infinite-query'
import { Paginated } from '@reminders/utils'
import { authFetch } from '@/lib/auth-fetch'
import { QuerySelect } from '@/hooks/types'
import { dayStart } from '@formkit/tempo'
import { getApiUrl } from '@/lib/getApiUrl'

type QueryOpts = PaginatedQueryOpts & { from?: string }

const defaultOpts: Required<QueryOpts> = {
  offset: 0,
  limit: 10,
  from: dayStart(new Date()).toISOString(),
}

export const eventsQueryOptions = <TData = Event[]>(
  opts: QueryOpts = defaultOpts,
  select?: QuerySelect<Event[], TData>,
) => {
  const {
    offset = defaultOpts.offset,
    limit = defaultOpts.limit,
    from = defaultOpts.from,
  } = opts

  return authInifiniteQueryOptions({
    queryKey: keys.events.paginated.key,
    initialPageParam: offset,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    queryFn: ({ pageParam }) => {
      const url = new URL(getApiUrl(keys.events.paginated.url))

      url.searchParams.set('from', from)
      url.searchParams.set('limit', limit.toString())
      url.searchParams.set('offset', pageParam.toString())

      return authFetch<Paginated<Event[]>>(url)
    },
    select,
  })
}

export const useEventsQuery = <TData = Event[]>(
  opts?: QueryOpts,
  select?: QuerySelect<Event[], TData>,
) => useAuthInfiniteQuery(eventsQueryOptions(opts, select))
