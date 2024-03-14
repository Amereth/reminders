import { getApiUrl } from '@/lib/getApiUrl'
import { toast } from 'sonner'
import { useCallback } from 'react'
import { useSupabase } from './useSupabase'

const methodsWithBody = ['POST', 'PUT', 'PATCH']

type ErrorResponse = {
  message: string
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

      console.log(new Map(request.headers))

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
