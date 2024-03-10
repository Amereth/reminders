import z from 'zod'

export const validateEnv = () =>
  z
    .object({
      VITE_API_URL: z.string(),
      VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    })
    .parse(import.meta.env)
