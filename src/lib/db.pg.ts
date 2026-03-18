import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.pg'

const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

const client = postgres(pgUrl!, { prepare: false })
export const db = drizzle(client, { schema })
