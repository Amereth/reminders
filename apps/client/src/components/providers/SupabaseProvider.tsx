import { supabaseClient } from '@/lib/supabase'
import { isUndefined } from '@/utils/isUndefined'
import { Session } from '@supabase/supabase-js'
import { LoaderIcon } from 'lucide-react'
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

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

  if (isUndefined(session))
    return (
      <div className='grid h-full place-content-center'>
        <LoaderIcon className='animate-spin' />
      </div>
    )

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
