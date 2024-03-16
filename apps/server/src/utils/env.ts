import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  DIRECT_URL: z.string(),
  DATABASE_URL: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  SUPABASE_PUBLIC_KEY: z.string(),
  SUPABASE_PROJECT_URL: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
