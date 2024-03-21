import { PropsWithChildren } from 'react'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { SupabaseProvider } from './SupabaseProvider'

export const Providers = ({ children }: PropsWithChildren) => (
  <SupabaseProvider>
    <TanstackQueryProvider>{children}</TanstackQueryProvider>
  </SupabaseProvider>
)
