import { Pool } from "pg";
import { betterAuth } from "better-auth/*";

const { PG_AUTH_HOST, PG_AUTH_DB, PG_AUTH_USER, PG_AUTH_PASSWORD } = process.env

const AUTH_DB_DETAILS = {
    host: PG_AUTH_HOST as string,
    database: PG_AUTH_DB as string,
    user: PG_AUTH_USER as string,
    password: PG_AUTH_PASSWORD as string,
    port: 5432,
    ssl: {
      rejectUnauthorized: false as boolean,
    },
  }

export default betterAuth({
 database: new Pool(AUTH_DB_DETAILS)
})