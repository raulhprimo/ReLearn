/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as pgSchema from './schema.pg'

type DB = PostgresJsDatabase<typeof pgSchema>

let _db: DB | null = null

function getDb(): DB {
  if (_db) return _db

  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing POSTGRES_URL or DATABASE_URL. Add it to .env.local for local dev.')
  }

  const postgres = require('postgres')
  const { drizzle } = require('drizzle-orm/postgres-js')
  const schema = require('./schema.pg')

  // Parse the URL manually to avoid postgres.js URL parsing issues
  // with dots in username (postgres.PROJECT_REF) and special chars in password
  const url = new URL(connectionString)
  const client = (postgres as any)({
    host: url.hostname,
    port: parseInt(url.port) || 6543,
    database: url.pathname.slice(1) || 'postgres',
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    prepare: false, // Required for Supabase Transaction Pooler
  })

  _db = drizzle(client, { schema }) as DB
  return _db
}

export const db: DB = new Proxy({} as DB, {
  get(_, prop) {
    return (getDb() as any)[prop]
  },
})
