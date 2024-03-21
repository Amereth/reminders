import { Session, SupabaseClient, createClient } from '@supabase/supabase-js'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

type SupabaseContext = {
  supabaseClient: SupabaseClient
  session: Session | null | undefined
  setSession: (arg: Session | null | undefined) => void
}

const defaultValue: SupabaseContext = {
  supabaseClient: {} as SupabaseClient,
  session: undefined,
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

  const [session, _setSession] = useState<Session | null | undefined>(undefined)

  const setSession = useCallback(
    (v: Session | null | undefined) => _setSession(v ? v : null),
    [_setSession],
  )

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
