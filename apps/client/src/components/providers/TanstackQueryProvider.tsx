import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { queryClient } from '@/lib/query'

export const TanstackQueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
