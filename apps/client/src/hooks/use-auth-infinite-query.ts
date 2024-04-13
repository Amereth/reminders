import { authFetch } from '@/lib/auth-fetch'
import {
  DefaultError,
  InfiniteData,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  infiniteQueryOptions,
  UseSuspenseInfiniteQueryOptions,
  QueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

export type PaginatedQueryOpts = {
  offset: number
  limit: number
}

export const authInifiniteQueryOptions = <
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UndefinedInitialDataInfiniteOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) =>
  infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(
    options,
  )

export const useAuthInfiniteQuery = <
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseSuspenseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >,
  queryClient?: QueryClient,
) =>
  useSuspenseInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(
    {
      queryFn: (request?: RequestInit) =>
        authFetch<TQueryFnData, TError>(options.queryKey[0] as string, request),
      ...options,
    },
    queryClient,
  )
