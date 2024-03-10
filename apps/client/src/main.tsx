import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen.ts'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../app/globals.css'
import { validateEnv } from './lib/validateEnv.ts'
import { api } from './lib/api.ts'

validateEnv()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
      queryFn: async ({ queryKey }) => {
        const response = await fetch(api(queryKey[0] as string))
        const data = await response.json()
        if (response.ok) return data
        throw new Error(data.message)
      },
    },
  },
})

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
