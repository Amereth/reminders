import z from 'zod'

export const validateEnv = () =>
  z
    .object({
      VITE_API_URL: z.string(),
      VITE_SUPABASE_PUBLIC_KEY: z.string(),
      VITE_SUPABASE_PROJECT_URL: z.string(),
    })
    .parse(import.meta.env)
