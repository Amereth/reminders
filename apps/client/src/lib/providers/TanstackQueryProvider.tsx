import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

export const TanstackQueryProvider = ({ children }: PropsWithChildren) => {
  const fetch = useAuthenticatedFetch()

  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: false,
            queryFn: async ({ queryKey }) => fetch(queryKey[0] as string),
          },
        },
      }),
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
