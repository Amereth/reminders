import {
  DefaultError,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { authFetch } from '@/lib/auth-fetch'

export const authQueryOptions = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
) =>
  queryOptions<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryFn: () =>
      authFetch<TQueryFnData, TError>(options.queryKey[0] as string),
  })

export const useAuthQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
) =>
  useSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      ...options,
      queryFn: (request?: RequestInit) =>
        authFetch<TQueryFnData, TError>(options.queryKey[0] as string, request),
    },
    queryClient,
  )
