import type { Config } from 'drizzle-kit'

const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

export default (pgUrl
  ? {
      schema: './src/lib/schema.pg.ts',
      out: './drizzle-pg',
      dialect: 'postgresql',
      dbCredentials: {
        url: pgUrl,
      },
    }
  : {
      schema: './src/lib/schema.sqlite.ts',
      out: './drizzle',
      dialect: 'sqlite',
      dbCredentials: {
        url: './data/raul.db',
      },
    }) satisfies Config
