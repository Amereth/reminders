import {
  DefaultError,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query'
import { useSupabase } from './useSupabase'
import { useAuthenticatedFetch } from './useAuthenticatedFetch'

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

  return useQuery(
    {
      ...options,
      enabled,
      queryFn: (request?: RequestInit) =>
        fetch(options.queryKey[0] as string, request),
    },
    queryClient,
  )
}
