import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
export const db = drizzle(process.env.PG_AUTH_CONNECTION_STRING!);