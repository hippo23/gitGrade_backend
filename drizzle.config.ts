import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './auth-schema.ts',
  dialect: 'postgresql',
  schemaFilter: ["auth"],
  dbCredentials: {
    url: process.env.PG_AUTH_CONNECTION_STRING!,
  },
});