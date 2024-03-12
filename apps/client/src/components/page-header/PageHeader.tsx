import { createClient } from '@supabase/supabase-js'
import { useEffect, useContext } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { UserSessionContext } from '@/lib/providers/UserSessionProvider'
import { Button } from '../ui/button'

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
)

export const PageHeader = () => {
  const [session, setSession] = useContext(UserSessionContext)

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

  return (
    <header className='flex items-center py-2 shadow-md shadow-slate-400 md:py-4'>
      {session ? (
        <Button>log out</Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>login</Button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-[425px]'>
            <Auth
              supabaseClient={supabaseClient}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
            />
          </DialogContent>
        </Dialog>
      )}
    </header>
  )
}
