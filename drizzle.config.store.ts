import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  schemaFilter: ["data-store"],
  dbCredentials: {
    url: process.env.PG_AUTH_CONNECTION_STRING!,
  },
});
