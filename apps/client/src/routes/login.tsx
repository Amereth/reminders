import { useSupabase } from '@hooks/useSupabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

const LoginComponent = () => {
  const navigate = useNavigate()
  const { supabaseClient, session } = useSupabase()

  useEffect(() => {
    if (session) navigate({ to: '/' })
  }, [navigate, session])

  return (
    <div className='flex h-full items-center justify-center'>
      <div className='max-w-[400px] grow'>
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})
