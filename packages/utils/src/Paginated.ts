export type Paginated<T> = {
  data: T
  offset: number
  nextOffset: number | null
  limit: number
  total: number
}
