import {
  DefaultError,
  QueryClient,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { useSupabase } from './useSupabase'
import { authenticatedFetch } from '../lib/authenticatedFetch'

export const useAuthenticatedMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, DefaultError, TVariables, TContext>,
  request?: RequestInit,
  queryClient?: QueryClient,
) => {
  const { session } = useSupabase()

  return useMutation<TData, DefaultError, TVariables, TContext>(
    {
      ...options,
      mutationFn: (variables) => {
        if (!session) throw new Error('No session found')

        return authenticatedFetch<TData, DefaultError>(
          options.mutationKey?.[0] as string,
          {
            ...request,
            body: JSON.stringify(variables),
          },
        )
      },
    },
    queryClient,
  )
}
