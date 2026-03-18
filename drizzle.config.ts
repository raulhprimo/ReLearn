import type { Config } from 'drizzle-kit'

const isPg = !!process.env.DATABASE_URL

export default (isPg
  ? {
      schema: './src/lib/schema.pg.ts',
      out: './drizzle-pg',
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DATABASE_URL!,
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
