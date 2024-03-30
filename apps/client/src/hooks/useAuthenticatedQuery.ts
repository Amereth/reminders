import {
  DefaultError,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  queryOptions,
  useQuery,
} from '@tanstack/react-query'
import { useSupabase } from './useSupabase'
import {
  authenticatedFetch,
  useAuthenticatedFetch,
} from './useAuthenticatedFetch'

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
    queryFn: () => authenticatedFetch(options.queryKey[0] as string),
  })

export const useAuthenticatedQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
) => {
  const fetch = useAuthenticatedFetch<TQueryFnData, TError>()
  const { session } = useSupabase()

  const enabled = options.enabled
    ? Boolean(session?.access_token && options.enabled)
    : Boolean(session?.access_token)

  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      ...options,
      enabled,
      queryFn: (request?: RequestInit) =>
        fetch(options.queryKey[0] as string, request),
    },
    queryClient,
  )
}
