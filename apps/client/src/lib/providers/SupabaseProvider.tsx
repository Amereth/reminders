import { Session, SupabaseClient, createClient } from '@supabase/supabase-js'
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react'

type SupabaseContext = {
  supabaseClient: SupabaseClient
  session: Session | null
  setSession: Dispatch<SetStateAction<Session | null>>
}

const defaultValue: SupabaseContext = {
  supabaseClient: {} as SupabaseClient,
  session: null,
  setSession: () => null,
}

export const SupabaseContext = createContext<SupabaseContext>(defaultValue)

export const SupabaseProvider = ({ children }: PropsWithChildren) => {
  const [supabaseClient] = useState(() =>
    createClient(
      import.meta.env.VITE_SUPABASE_PROJECT_URL,
      import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
    ),
  )

  const [session, setSession] = useState<Session | null>(null)

  // set session on mount
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabaseClient.auth, setSession])

  return (
    <SupabaseContext.Provider
      value={{
        supabaseClient,
        session,
        setSession,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}
