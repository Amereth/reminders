import {
  DefaultError,
  QueryClient,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { useSupabase } from './useSupabase'
import { authFetch } from '../lib/auth-fetch'

type CustomOptions<TVariables> = {
  getRequestUrl: (variables: TVariables) => string
}

export const useAuthMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  { getRequestUrl }: CustomOptions<TVariables>,
  options: UseMutationOptions<TData, DefaultError, TVariables, TContext>,
  request?: RequestInit,
  queryClient?: QueryClient,
) => {
  const { session } = useSupabase()

  return useMutation<TData, DefaultError, TVariables, TContext>(
    {
      ...options,
      // FIXME
      mutationFn: (variables) => {
        if (!session) throw new Error('No session found')

        return authFetch<TData, DefaultError>(getRequestUrl(variables), {
          ...request,
          body: JSON.stringify(variables),
        })
      },
    },
    queryClient,
  )
}
