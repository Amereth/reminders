import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
  DIRECT_URL: z.string(),
  DATABASE_URL: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
})

export const env = envSchema.parse(process.env)
