import { Pool } from 'pg'

// regular pg instance for legacy functions
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env
const DATABASE_DETAILS = {
  host: PGHOST as string,
  database: PGDATABASE as string,
  user: PGUSER as string,
  password: PGPASSWORD as string,
  port: 5432,
  ssl: {
    rejectUnauthorized: false as boolean,
  },
}
const stcf_db = new Pool(DATABASE_DETAILS)

// migrating to drizzle db for future calls

export { stcf_db }
