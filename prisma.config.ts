import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

import 'dotenv/config'

console.log(process.env.TURSO_AUTH_TOKEN, process.env.TURSO_DATABASE_URL);


export default defineConfig({
  experimental: {
    adapter: true,
  },
  schema: path.join('prisma', 'schema.prisma'),
  async adapter() {
    return new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL as string,
      authToken: process.env.TURSO_AUTH_TOKEN as string,
    })
  }
})

// turso db shell turso-prisma-db < ./prisma/migrations/20251028065824_test/migration.sql