import z from 'zod'

export const validateEnv = () =>
  z
    .object({
      VITE_API_URL: z.string(),
    })
    .parse(import.meta.env)
