import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Button } from '../ui/button'
import { useSupabase } from '@/hooks/useSupabase'

export const PageHeader = () => {
  const { supabaseClient, session } = useSupabase()

  const signOut = () => supabaseClient.auth.signOut()

  return (
    <header className='flex items-center py-2 md:py-4'>
      {session ? (
        <Button onClick={signOut}>log out</Button>
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
