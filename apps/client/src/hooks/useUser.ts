import { UserSessionContext } from '@/lib/providers/UserSessionProvider'
import { useContext } from 'react'

export const useUser = () => {
  const [session] = useContext(UserSessionContext)

  return session?.user
}
