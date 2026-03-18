/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type * as sqliteSchema from './schema.sqlite'

type DB = BetterSQLite3Database<typeof sqliteSchema>

const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

let _db: DB | null = null

function getDb(): DB {
  if (_db) return _db

  if (pgUrl) {
    const postgres = require('postgres')
    const { drizzle } = require('drizzle-orm/postgres-js')
    const pgSchema = require('./schema.pg')
    const client = postgres(pgUrl, { prepare: false })
    _db = drizzle(client, { schema: pgSchema }) as unknown as DB
  } else {
    const Database = require('better-sqlite3')
    const { drizzle } = require('drizzle-orm/better-sqlite3')
    const sqliteSchema = require('./schema.sqlite')
    const path = require('path')
    const dbPath = path.join(process.cwd(), 'data', 'raul.db')
    const sqlite = new Database(dbPath)
    sqlite.pragma('journal_mode = WAL')
    _db = drizzle(sqlite, { schema: sqliteSchema }) as unknown as DB
  }

  return _db
}

// Proxy delays initialization until first property access at runtime.
// This prevents better-sqlite3 from being evaluated at module load time on Vercel.
export const db: DB = new Proxy({} as DB, {
  get(_, prop) {
    return (getDb() as any)[prop]
  },
})
