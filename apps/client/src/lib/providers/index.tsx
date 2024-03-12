import { PropsWithChildren } from 'react'
import { TanstackQueryProvider } from './TanstackQueryProvider'
import { UserSessionProvider } from './UserSessionProvider'

export const Providers = ({ children }: PropsWithChildren) => (
  <TanstackQueryProvider>
    <UserSessionProvider>{children}</UserSessionProvider>
  </TanstackQueryProvider>
)
