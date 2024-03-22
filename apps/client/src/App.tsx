import { RouterProvider, createRouter } from '@tanstack/react-router'
import { useSupabase } from './hooks/useSupabase'
import { routeTree } from './routeTree.gen'
import { Session } from '@supabase/supabase-js'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    session: null,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export type RouterContext = {
  session: Session | null
}

export const App = () => {
  const { session } = useSupabase()

  return <RouterProvider router={router} context={{ session }} />
}