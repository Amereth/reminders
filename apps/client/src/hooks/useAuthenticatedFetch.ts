import { getApiUrl } from '@/lib/getApiUrl'
import { toast } from 'sonner'
import { useCallback } from 'react'
import { useSupabase } from './useSupabase'
import { supabaseClient } from '@/lib/supabase'

const methodsWithBody = ['POST', 'PUT', 'PATCH']

type ErrorResponse = {
  message: string
}

export const authenticatedFetch = async <TData = unknown, TError = Error>(
  input: string,
  request: RequestInit | undefined = {},
) => {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  if (!session) {
    throw new Error('No session found')
  }

  const headers = new Headers(request.headers)

  const access_token = session.access_token
  headers.append('authorization', `Bearer ${access_token}`)

  const contentType =
    request.method && methodsWithBody.includes(request.method)
      ? 'application/json'
      : ''
  contentType && headers.append('content-type', contentType)

  request.headers = headers

  return fetch(getApiUrl(input), request)
    .then(async (response) => {
      const data = (await response.json()) as TData | ErrorResponse

      if (response.ok) return data as TData

      if ('message' in (data as ErrorResponse)) {
        throw new Error((data as ErrorResponse).message)
      }

      if (typeof data === 'string') throw new Error(data)

      throw new Error('Something went wrong')
    })
    .catch((error: TError) => {
      if (error instanceof Error) toast.error(error.message)
      throw error
    })
}

export const useAuthenticatedFetch = <TData, TError = Error>() => {
  const { session } = useSupabase()

  return useCallback(
    async (input: string, request: RequestInit | undefined = {}) => {
      const headers = new Headers(request.headers)

      const access_token = session?.access_token
      headers.append('authorization', `Bearer ${access_token}`)

      const contentType =
        request.method && methodsWithBody.includes(request.method)
          ? 'application/json'
          : ''
      contentType && headers.append('content-type', contentType)

      request.headers = headers

      return fetch(getApiUrl(input), request)
        .then(async (response) => {
          const data = (await response.json()) as TData | ErrorResponse

          if (response.ok) return data as TData

          if ('message' in (data as ErrorResponse)) {
            throw new Error((data as ErrorResponse).message)
          }

          if (typeof data === 'string') throw new Error(data)

          throw new Error('Something went wrong')
        })
        .catch((error: TError) => {
          if (error instanceof Error) toast.error(error.message)
          throw error
        })
    },
    [session?.access_token],
  )
}
