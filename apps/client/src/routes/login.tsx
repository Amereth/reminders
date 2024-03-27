import { useSupabase } from '@hooks/useSupabase'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { isNull } from '@utils/isNull'

const LoginComponent = () => {
  const { session } = useSupabase()

  console.log('login page')

  if (isNull(session)) {
    redirect({ to: '/' })
  }

  return <div>Hello /login!</div>
}

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})
