import { getApiUrl } from '@/lib/getApiUrl'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'

const methodsWithBody = ['POST', 'PUT', 'PATCH']

type ErrorResponse = {
  message: string
}

export const useAuthenticatedFetch = <TData>() => {
  const { getToken } = useAuth()

  return async (input: string, request: RequestInit | undefined = {}) => {
    const contentType =
      request.method && methodsWithBody.includes(request.method)
        ? 'application/json'
        : ''

    const isFormData = request.body instanceof FormData

    const modifiedRequest: RequestInit = {
      ...request,
      headers: {
        authorization: `Bearer ${await getToken()}`,
        ...(isFormData ? {} : { 'content-type': contentType }),
        ...request.headers,
      },
    }

    return fetch(getApiUrl(input), modifiedRequest)
      .then(async (response) => {
        const data = (await response.json()) as TData | ErrorResponse

        if (response.ok) return data as TData

        if ('message' in (data as ErrorResponse)) {
          throw new Error((data as ErrorResponse).message)
        }

        if (typeof data === 'string') throw new Error(data)

        throw new Error('Something went wrong')
      })
      .catch((error: Error) => {
        toast.error(error.message)
        throw error
      })
  }
}
