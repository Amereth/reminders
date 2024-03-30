import {
  DefaultError,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { authenticatedFetch } from '@lib/authenticatedFetch'

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
      authenticatedFetch<TQueryFnData, TError>(options.queryKey[0] as string),
  })

export const useAuthenticatedQuery = <
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
        authenticatedFetch<TQueryFnData, TError>(
          options.queryKey[0] as string,
          request,
        ),
    },
    queryClient,
  )
