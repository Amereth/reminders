import { Paginated } from '@reminders/utils'
import { InfiniteData } from '@tanstack/react-query'

export type QuerySelect<TEntry, TData> = (
  data: InfiniteData<Paginated<TEntry>>,
) => InfiniteData<Paginated<TData>>
