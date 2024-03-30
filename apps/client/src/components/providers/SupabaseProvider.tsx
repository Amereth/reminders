import { supabaseClient } from '@/lib/supabase'
import { isUndefined } from '@/utils/isUndefined'
import { Session } from '@supabase/supabase-js'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Loader } from '../Loader'

type SupabaseContext = {
  session: Session | null | undefined
  setSession: (arg: Session | null | undefined) => void
}

const defaultValue: SupabaseContext = {
  session: undefined,
  setSession: () => null,
}

export const SupabaseContext = createContext<SupabaseContext>(defaultValue)

export const SupabaseProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true)
  // show 0.3s loader instead of flickering
  useEffect(() => {
    setTimeout(() => setLoading(false), 300)
  }, [])

  const [session, _setSession] = useState<Session | null | undefined>(undefined)

  const setSession = useCallback(
    (s: Session | null | undefined) => _setSession(s ?? null),
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
  }, [setSession])

  if (loading || isUndefined(session)) return <Loader />

  return (
    <SupabaseContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}
