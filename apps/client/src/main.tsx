import React from 'react'
import ReactDOM from 'react-dom/client'
import '../app/globals.css'
import { validateEnv } from './lib/validateEnv.ts'
import { Toaster } from './components/ui/sonner.tsx'
import { Providers } from './components/providers/index.tsx'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { App } from './App.tsx'

dayjs.extend(localizedFormat)

validateEnv()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <Toaster richColors />
      <App />
    </Providers>
  </React.StrictMode>,
)
