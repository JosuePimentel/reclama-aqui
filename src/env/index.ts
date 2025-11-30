import { z } from "zod"
import 'dotenv/config'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  ENVIRONMENT: z.string(),
  DATABASE_URL: z.string(),
  HASH_SALT: z.coerce.number()
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  new Error('Invalid environment variable!')
}

export const env = _env.data