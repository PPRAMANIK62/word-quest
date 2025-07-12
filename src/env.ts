import { z } from 'zod'

const envSchema = z.object({
  // Define your environment variables here
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_APP_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
})

export const env = envSchema.parse(import.meta.env)
