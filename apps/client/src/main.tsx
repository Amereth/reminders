import React from 'react'
import ReactDOM from 'react-dom/client'
import '../app/globals.css'
import { Toaster } from '@ui/sonner'
import { App } from './App.tsx'
import { Providers } from './components/providers/index.tsx'
import { validateEnv } from './lib/validateEnv.ts'

validateEnv()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <Toaster richColors duration={10_000} />
      <App />
    </Providers>
  </React.StrictMode>,
)
