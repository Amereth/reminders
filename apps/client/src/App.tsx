import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { useSupabase } from '@hooks/useSupabase'
import { queryClient } from './lib/query'
import { QueryClient } from '@tanstack/react-query'
import { supabaseClient } from '@lib/supabase'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    session: null,
    queryClient,
    supabaseClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export type RouterContext = {
  session: Session | null
  supabaseClient: SupabaseClient
  queryClient: QueryClient
}

export const App = () => {
  const { session } = useSupabase()

  return <RouterProvider router={router} context={{ session }} />
}
