import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen.ts'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import '../app/globals.css'
import { validateEnv } from './lib/validateEnv.ts'
import { Toaster } from './components/ui/sonner.tsx'
import { TanstackQueryProvider } from './lib/providers/TanstackQueryProvider.tsx'

validateEnv()

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
    <TanstackQueryProvider>
      <Toaster richColors />
      <RouterProvider router={router} />
    </TanstackQueryProvider>
  </React.StrictMode>,
)
