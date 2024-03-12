import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen.ts'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import '../app/globals.css'
import { validateEnv } from './lib/validateEnv.ts'
import { Toaster } from './components/ui/sonner.tsx'
import { Providers } from './lib/providers/index.tsx'

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
    <Providers>
      <Toaster richColors />
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
)
