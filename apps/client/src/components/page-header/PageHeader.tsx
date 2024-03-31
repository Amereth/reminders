import { Dialog, DialogContent, DialogTrigger } from '@ui/dialog'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Button } from '@ui/button'
import { useSupabase } from '@hooks/useSupabase'
import { useNavigate } from '@tanstack/react-router'
import { supabaseClient } from '@/lib/supabase'

export const PageHeader = () => {
  const navigate = useNavigate()
  const { session } = useSupabase()

  const signOut = () => {
    supabaseClient.auth.signOut()
    navigate({ to: '/login' })
  }

  return (
    <header className='flex flex-col'>
      <div className='flex items-center py-4'>
        {session ? (
          <Button onClick={signOut} variant='outline'>
            log out
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost'>login</Button>
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
      </div>

      <div className='bg-primary h-[1px]'></div>
    </header>
  )
}
