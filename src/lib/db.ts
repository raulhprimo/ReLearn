/* eslint-disable @typescript-eslint/no-require-imports */
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type * as sqliteSchema from './schema.sqlite'
import * as schema from './schema'

// Use SQLite DB type as canonical for TypeScript inference.
// At runtime, the correct driver (SQLite or PostgreSQL) is used.
type DB = BetterSQLite3Database<typeof sqliteSchema>

let _db: DB

if (process.env.DATABASE_URL) {
  // ── Produção: PostgreSQL (Supabase) ──────────────────────────────────────
  const postgres = require('postgres')
  const { drizzle } = require('drizzle-orm/postgres-js')
  const client = postgres(process.env.DATABASE_URL, { prepare: false })
  _db = drizzle(client, { schema }) as unknown as DB
} else {
  // ── Local: SQLite ────────────────────────────────────────────────────────
  const Database = require('better-sqlite3')
  const { drizzle } = require('drizzle-orm/better-sqlite3')
  const path = require('path')
  const dbPath = path.join(process.cwd(), 'data', 'raul.db')
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  _db = drizzle(sqlite, { schema }) as unknown as DB
}

export const db = _db
