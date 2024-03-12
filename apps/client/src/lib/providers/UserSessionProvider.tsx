import { Session } from '@supabase/supabase-js'
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from 'react'

type UserSessionContext = [
  Session | null,
  Dispatch<SetStateAction<Session | null>>,
]

const defaultValue: UserSessionContext = [null, () => null]

export const UserSessionContext =
  createContext<UserSessionContext>(defaultValue)

export const UserSessionProvider = ({ children }: PropsWithChildren) => {
  const sessionState = useState<Session | null>(null)

  return (
    <UserSessionContext.Provider value={sessionState}>
      {children}
    </UserSessionContext.Provider>
  )
}
